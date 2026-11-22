import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { same, t } from "@ga/content";
import {
  type Coefficient,
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
  svgDocument,
  union,
} from "@ga/subject-math";
import { algebraDrawings } from "../explanation-drawings-algebra.ts";
import { gradeDrawings5 } from "../explanation-drawings-grades-5.ts";
import { annotate, guides, hits as level, onAxis, setText as setAlt, at as spot, stretchOf } from "../graph-figures.ts";
import {
  choiceProblem,
  expressionProblem,
  intervalProblem,
  numberProblem,
  pointProblem,
  solutionsProblem,
  steps,
  verdictChoice,
  yesNo,
} from "../problems.ts";
import { range, tail, valueTable, view } from "../solution-kit.ts";
import { reasoned } from "../wrong-reasons.ts";

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
export function graphFigure(pieces: readonly Piece[], name = "f"): Figure {
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

// Worked steps.

/** sumLatex writes numbers added in turn: "18 + 12 - 1". */
function sumLatex(values: readonly number[]): string {
  if (values.length === 0) return "0";
  return values.map((v, i) => (i === 0 ? num(v) : v < 0 ? ` - ${num(-v)}` : ` + ${num(v)}`)).join("");
}

/** termValues lists the values of the nonzero terms of a polynomial at k, from the highest power down. */
function termValues(p: Poly, k: number): number[] {
  const out: number[] = [];
  for (let i = p.length - 1; i >= 0; i--) if (p[i] !== 0) out.push(p[i]! * k ** i);
  return out;
}

/** evaluation writes the substitution of k into a polynomial, the value of each term, and the total: "f(-2) = …". */
function evaluation(name: string, p: Poly, k: number): string {
  return steps(`${name}(${num(k)}) = ${substitution(p, k)}`, `= ${sumLatex(termValues(p, k))}`, `= ${num(evalPoly(p, k))}`);
}

/** undoConstant tells how to move the constant b of ax + b to the other side. */
function undoConstant(b: number): Text {
  return b > 0 ? t(`subtract $${b}$ from both sides`, `两边同时减去 $${b}$`) : t(`add $${-b}$ to both sides`, `两边同时加上 $${-b}$`);
}

// Mapping diagrams.

/** mappingFigure draws a mapping diagram: the inputs in a left oval, the outputs in a right one, an arrow for each pair; arrows from the input marked are drawn as the result. */
export function mappingFigure(rows: readonly Point[], en: string, zh: string, marked?: number): Figure {
  const ins = [...new Set(rows.map((r) => r[0]))];
  const outs = [...new Set(rows.map((r) => r[1]))].sort((a, b) => a - b);
  const n = Math.max(ins.length, outs.length);
  const gap = 30;
  const top = 40;
  const height = top + n * gap + 10;
  const yOf = (i: number, count: number) => Math.round(top + gap / 2 + (i + (n - count) / 2) * gap);
  const ry = (n * gap) / 2 + 6;
  const cy = top + (n * gap) / 2;
  let body = `<g stroke="none" fill="currentColor"><text x="80" y="22" font-style="italic">x</text><text x="240" y="22" font-style="italic">y</text>`;
  ins.forEach((x, i) => {
    body += `<text x="80" y="${yOf(i, ins.length) + 4}">${x}</text>`;
  });
  outs.forEach((y, i) => {
    body += `<text x="240" y="${yOf(i, outs.length) + 4}">${y}</text>`;
  });
  body += `</g><ellipse cx="80" cy="${cy}" rx="42" ry="${ry}"/><ellipse cx="240" cy="${cy}" rx="42" ry="${ry}"/>`;
  for (const [x, y] of rows) {
    const [x1, y1] = [102, yOf(ins.indexOf(x), ins.length)];
    const [x2, y2] = [216, yOf(outs.indexOf(y), outs.length)];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const [ux, uy] = [(x2 - x1) / len, (y2 - y1) / len];
    const r = (v: number) => Math.round(v * 100) / 100;
    const head = [
      [x2, y2],
      [x2 - 8 * ux - 4 * uy, y2 - 8 * uy + 4 * ux],
      [x2 - 8 * ux + 4 * uy, y2 - 8 * uy - 4 * ux],
    ]
      .map(([a, b]) => `${r(a!)},${r(b!)}`)
      .join(" ");
    const tone = x === marked ? ' class="result"' : ' class="accent"';
    body += `<g${tone}><line x1="${x1}" y1="${y1}" x2="${r(x2 - 6 * ux)}" y2="${r(y2 - 6 * uy)}"/><polygon points="${head}" fill="currentColor"/></g>`;
  }
  return { svg: svgDocument(height, body), alt: t(en, zh) };
}

/** arrowsAlt describes the arrows of a mapping diagram for alt text. */
const arrowsAlt = (rows: readonly Point[]): Text =>
  t(rows.map(([x, y]) => `${x} → ${y}`).join(", "), rows.map(([x, y]) => `${x} → ${y}`).join("，"));

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
    { topic: "evaluating-expressions", weight: 0.3 },
    { topic: "two-step-equations", weight: 0.2 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.A.2"],
  intro: t(
    `You already know how to evaluate an expression such as $2x + 3$: put in a number for $x$ and work out the result. Suppose a taxi charges $3$ dollars to start and $2$ dollars per kilometer. A ride of $x$ kilometers costs $2x + 3$ dollars, so a ride of $4$ kilometers costs $2(4) + 3 = 11$ dollars. Each distance we put in gives back **one** cost:

{{figure 0}}

A rule like this, which takes an **input** and gives back **exactly one output**, is called a **function**. Because the output is never in doubt, we can give the rule a name, say $f$, and write $f(4) = 11$: "$f$ of $4$ is $11$". The whole rule is written $f(x) = 2x + 3$.

Functions are how mathematics describes one quantity depending on another: a cost on a distance, a temperature on the time of day, an area on a length. In this lesson we decide when a list of input–output pairs is a function, evaluate functions written in function notation, and work backward from an output to the input that gives it.`,
    `你已经会求代数式（例如 $2x + 3$）的值：给 $x$ 代入一个数，算出结果。假设出租车起步价 $3$ 元，每公里再收 $2$ 元。乘车 $x$ 公里的费用是 $2x + 3$ 元，所以乘车 $4$ 公里的费用是 $2(4) + 3 = 11$ 元。每代入一个距离，都会得到**一个**费用：

{{figure 0}}

像这样接收一个**输入**、给出**恰好一个输出**的规则，叫做**函数**。因为输出是确定的，我们可以给这个规则起个名字，比如 $f$，并写成 $f(4) = 11$，读作"$f$ $4$ 等于 $11$"。整个规则写作 $f(x) = 2x + 3$。

数学用函数描述一个量随另一个量变化的关系：费用随距离变化，气温随时刻变化，面积随边长变化。这节课先判断一组输入–输出数对是不是函数，再用函数记号求函数值，最后由输出反推出对应的输入。`,
  ),
  introFigures: [
    mappingFigure(
      [
        [1, 5],
        [2, 7],
        [3, 9],
        [4, 11],
      ],
      "A mapping diagram of the taxi cost f(x) = 2x + 3: the distances 1, 2, 3, 4 on the left, each with one arrow to its cost 5, 7, 9, 11 on the right.",
      "出租车费用 f(x) = 2x + 3 的映射图：左边是距离 1、2、3、4，各引出一个箭头，指向右边的费用 5、7、9、11。",
    ),
  ],
  knowledgePoints: [
    {
      id: "relations-and-functions",
      title: t("Relations and functions", "关系与函数"),
      explanation: t(
        `A **relation** is any pairing of inputs with outputs, for example a set of ordered pairs $(x, y)$, where $x$ is the input and $y$ the output. A relation is a **function** if every input has **exactly one** output.

Why insist on this? A function is meant to answer the question "what is the output for this input?" If the input $1$ were paired with both $4$ and $5$, the question would have two answers, and $f(1)$ would mean nothing definite.

Take $\\{(1, 4), (2, 4), (3, 7)\\}$. List the inputs: $1, 2, 3$. None is repeated, so each input has one output, and the relation is a function. The inputs $1$ and $2$ share the output $4$, and that is allowed: each of them still has only one output.

Now take $\\{(1, 4), (1, 5), (3, 7)\\}$. The input $1$ appears twice, with two different outputs:

{{figure 0}}

So this relation is not a function.

> **Watch out.** Only repeated **inputs** can spoil a function. A repeated **output**, such as two different inputs both sent to $4$, is perfectly fine. Look down the list of first coordinates, not second coordinates.`,
        `**关系**是输入与输出的任意一种配对，例如写成有序数对 $(x, y)$ 的集合，其中 $x$ 是输入，$y$ 是输出。如果每个输入都**恰好有一个**输出，这个关系就是**函数**。

为什么要这样规定？函数是用来回答"这个输入的输出是多少"的。如果输入 $1$ 同时与 $4$ 和 $5$ 配对，这个问题就有两个答案，$f(1)$ 也就没有确定的意义了。

看 $\\{(1, 4), (2, 4), (3, 7)\\}$。列出输入：$1, 2, 3$。没有重复，所以每个输入只有一个输出，这个关系是函数。输入 $1$ 和 $2$ 的输出都是 $4$，这是允许的：它们各自仍然只有一个输出。

再看 $\\{(1, 4), (1, 5), (3, 7)\\}$。输入 $1$ 出现了两次，对应两个不同的输出：

{{figure 0}}

所以这个关系不是函数。

> **注意。** 只有**输入**重复才会破坏函数。**输出**重复（比如两个不同的输入都对应 $4$）完全没有问题。要检查的是第一个坐标，而不是第二个坐标。`,
      ),
      figures: [
        mappingFigure(
          [
            [1, 4],
            [1, 5],
            [3, 7],
          ],
          "A mapping diagram of {(1, 4), (1, 5), (3, 7)}: two arrows leave the input 1, to 4 and to 5.",
          "{(1, 4), (1, 5), (3, 7)} 的映射图：输入 1 引出两个箭头，分别指向 4 和 5。",
          1,
        ),
      ],
      generate(rng) {
        const n = rng.int(4, 5);
        const xs = rng.sample(range(-6, 9), n);
        const ys = xs.map(() => rng.int(-9, 9));
        const isFunction = rng.bool();
        if (isFunction && rng.bool()) ys[1] = ys[0]!;
        if (!isFunction) {
          xs[n - 1] = xs[0]!;
          ys[n - 1] = ys[0]! + rng.nonZero(-4, 4);
        }
        const ps = rng.shuffle(xs.map((x, i): Point => [x, ys[i]!]));
        const inputs = ps.map(([x]) => num(x)).join(", ");
        const sharedOutput = isFunction && ys[1] === ys[0];
        const verdict = isFunction
          ? t(
              `**Step 2: decide.** No input is repeated, so each input has exactly one output: the relation **is** a function.${sharedOutput ? ` The inputs $${xs[0]}$ and $${xs[1]}$ share the output $${ys[0]}$, which is allowed.` : ""}`,
              `**第二步：判断。** 没有重复的输入，所以每个输入恰好有一个输出：这个关系**是**函数。${sharedOutput ? `输入 $${xs[0]}$ 和 $${xs[1]}$ 的输出都是 $${ys[0]}$，这是允许的。` : ""}`,
            )
          : t(
              `**Step 2: decide.** The input $${xs[0]}$ appears twice, once with the output $${ys[0]}$ and once with $${ys[n - 1]}$. One input with two outputs means the relation is **not** a function.`,
              `**第二步：判断。** 输入 $${xs[0]}$ 出现了两次，一次对应输出 $${ys[0]}$，一次对应 $${ys[n - 1]}$。一个输入有两个输出，所以这个关系**不是**函数。`,
            );
        return choiceProblem({
          prompt: t(`Is the relation $${pairs(ps)}$ a function?`, `关系 $${pairs(ps)}$ 是函数吗？`),
          options: yesNo,
          correct: isFunction ? 0 : 1,
          solution: t(
            `**Step 1: list the inputs.** The inputs are the first coordinates: $${inputs}$. A function needs each of them to have one output, so look for an input that repeats.\n\n${verdict.en}`,
            `**第一步：列出输入。** 输入是各数对的第一个坐标：$${inputs}$。函数要求每个输入只有一个输出，所以要找有没有重复的输入。\n\n${verdict["zh-CN"]}`,
          ),
        });
      },
    },
    {
      id: "function-notation",
      title: t("Function notation", "函数记号"),
      explanation: t(
        `A function is often given by a name and a formula. $f(x) = x^{2} - 3x$ means: the function $f$ sends the input $x$ to the output $x^{2} - 3x$. Read $f(x)$ as "$f$ of $x$". The parentheses hold the input; $f(x)$ is **not** $f$ times $x$.

The formula is a recipe with a blank where the input goes. To find $f(-2)$, put $-2$ into **every** place where $x$ stands, each time inside parentheses, then follow the order of operations:

$$f(-2) = (-2)^{2} - 3(-2) = 4 + 6 = 10.$$

The parentheses matter because the whole input, sign included, is what gets squared or multiplied: $(-2)^{2}$ is $(-2)(-2) = 4$.

> **Watch out.** Without parentheses, $-2^{2}$ means $-(2^{2}) = -4$, and the answer comes out wrong. Likewise $-3(-2)$ is $+6$, not $-6$. Write the parentheses first, then simplify.`,
        `函数常用名称和公式给出。$f(x) = x^{2} - 3x$ 表示：函数 $f$ 把输入 $x$ 对应到输出 $x^{2} - 3x$。$f(x)$ 读作"$f$ $x$"，括号里放的是输入，$f(x)$ **不是** $f$ 乘以 $x$。

公式就像一份留有空位的"配方"，空位处填入输入。求 $f(-2)$ 时，把 $-2$ 填入**每一个** $x$ 的位置，每次都带上括号，再按运算顺序计算：

$$f(-2) = (-2)^{2} - 3(-2) = 4 + 6 = 10.$$

括号很重要，因为被平方、被相乘的是整个输入，包括它的符号：$(-2)^{2} = (-2)(-2) = 4$。

> **注意。** 不加括号时，$-2^{2}$ 表示 $-(2^{2}) = -4$，结果就错了。同样，$-3(-2)$ 等于 $+6$，不是 $-6$。先写括号，再化简。`,
      ),
      keyPrerequisites: ["evaluating-expressions"],
      generate(rng) {
        const name = rng.pick(names);
        const p: Poly = rng.bool(0.3) ? [rng.int(-9, 9), rng.nonZero(-6, 6)] : [rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-3, 3)];
        const k = rng.nonZero(-5, 5);
        const value = evalPoly(p, k);
        const signSlip = p.reduce((acc, c, i) => acc + c * (i === 2 ? -(k * k) : k ** i), 0);
        const square =
          p.length === 3
            ? t(
                `**Step 2: powers first.** $(${k})^{2} = ${k * k}$.${k < 0 ? " The whole input, sign included, is squared, so the result is positive." : ""}`,
                `**第二步：先算乘方。** $(${k})^{2} = ${k * k}$。${k < 0 ? "平方的是带符号的整个输入，所以结果是正数。" : ""}`,
              )
            : undefined;
        const last = square ? t("Step 3", "第三步") : t("Step 2", "第二步");
        return numberProblem({
          prompt: t(
            `Given $${name}(x) = ${polyLatex(p)}$, find $${name}(${k})$.`,
            `已知 $${name}(x) = ${polyLatex(p)}$，求 $${name}(${k})$。`,
          ),
          answer: value,
          wrong: [evalPoly(p, -k), signSlip, evalPoly(p, k) - 2 * (p[0] ?? 0)],
          solution: t(
            `**Step 1: substitute.** Replace every $x$ in the formula with $(${k})$, keeping the parentheses so that the sign stays with the number.${square ? `\n\n${square.en}` : ""}

**${last.en}: multiply, then add.** Work out each term, then add them:${evaluation(name, p, k)}So $${valueLatex(name, k, value)}$.`,
            `**第一步：代入。** 把公式中的每个 $x$ 都换成 $(${k})$，保留括号，让符号跟着这个数。${square ? `\n\n${square["zh-CN"]}` : ""}

**${last["zh-CN"]}：先乘后加。** 算出每一项，再相加：${evaluation(name, p, k)}所以 $${valueLatex(name, k, value)}$。`,
          ),
        });
      },
    },
    {
      id: "finding-an-input",
      title: t("Finding the input for an output", "由输出求输入"),
      explanation: t(
        `Evaluating goes from an input to its output. Often we need the opposite direction: $f(x) = 11$ asks which **input** has the output $11$. Since $f(x)$ stands for the formula, the question is an equation in $x$, and we solve it by undoing the operations of the formula in reverse order.

For $f(x) = 3x - 4$, the formula multiplies by $3$, then subtracts $4$. Undo the subtraction first, then the multiplication:

$$3x - 4 = 11 \\;\\Rightarrow\\; 3x = 15 \\;\\Rightarrow\\; x = 5.$$

Putting the input back in confirms it: $f(5) = 3(5) - 4 = 11$.

> **Watch out.** $f(x) = 11$ is not $f(11)$. The number $11$ here is an **output**, so it goes on the right of the equation, not in place of $x$. Computing $3(11) - 4 = 29$ answers a different question.`,
        `求函数值是从输入得到输出。很多时候需要反过来：$f(x) = 11$ 是问哪个**输入**的输出是 $11$。因为 $f(x)$ 代表公式，这个问题就是关于 $x$ 的方程，按与公式相反的顺序逐步还原就能解出。

对于 $f(x) = 3x - 4$，公式先乘以 $3$，再减去 $4$。所以先还原减法，再还原乘法：

$$3x - 4 = 11 \\;\\Rightarrow\\; 3x = 15 \\;\\Rightarrow\\; x = 5.$$

把这个输入代回去验证：$f(5) = 3(5) - 4 = 11$。

> **注意。** $f(x) = 11$ 不是 $f(11)$。这里的 $11$ 是**输出**，应放在方程右边，而不是代替 $x$。算 $3(11) - 4 = 29$ 回答的是另一个问题。`,
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const name = rng.pick(names);
        const a = rng.sign() * rng.int(2, 9);
        const b = rng.nonZero(-15, 15);
        const x = rng.int(-9, 9);
        const c = a * x + b;
        const undo = undoConstant(b);
        return numberProblem({
          prompt: t(
            `Given $${name}(x) = ${linear(a, b)}$, find the value of $x$ for which $${name}(x) = ${num(c)}$.`,
            `已知 $${name}(x) = ${linear(a, b)}$，求使 $${name}(x) = ${num(c)}$ 的 $x$ 的值。`,
          ),
          answer: x,
          solveFor: "x",
          wrong: [a * c + b, Q.of(c + b, a), -x],
          solution: t(
            `**Step 1: write the equation.** The output is $${num(c)}$, so the formula must equal $${num(c)}$:${steps(`${linear(a, b)} = ${num(c)}`)}**Step 2: undo the constant.** To leave the $x$ term alone, ${undo.en}:${steps(`${poly([a, "x"])} = ${num(c - b)}`)}**Step 3: undo the multiplication.** Divide both sides by $${a}$:${steps(`x = ${num(x)}`)}**Check.** $${name}(${x}) = ${a}(${x})${tail(b)} = ${num(a * x)}${tail(b)} = ${num(c)}$, the output we wanted.`,
            `**第一步：列方程。** 输出是 $${num(c)}$，所以公式等于 $${num(c)}$：${steps(`${linear(a, b)} = ${num(c)}`)}**第二步：还原常数项。** 为了只留下含 $x$ 的项，${undo["zh-CN"]}：${steps(`${poly([a, "x"])} = ${num(c - b)}`)}**第三步：还原乘法。** 两边同时除以 $${a}$：${steps(`x = ${num(x)}`)}**检验。** $${name}(${x}) = ${a}(${x})${tail(b)} = ${num(a * x)}${tail(b)} = ${num(c)}$，正是要求的输出。`,
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
  encompasses: [],
  xp: 10,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.A.2"],
  intro: t(
    `A function is a rule that gives each input exactly one output. So far the rule came as a formula, such as $f(x) = 2x + 3$. But a function is really just its input–output pairs, and the pairs can be shown without any formula. A table puts each input above its output:

$$\\begin{array}{c|cccc} x & 1 & 2 & 3 & 4 \\\\ \\hline f(x) & 5 & 7 & 9 & 11 \\end{array}$$

A **mapping diagram** draws the same pairs as arrows, from each input to its output:

{{figure 0}}

Both show the same function: the column under $3$ and the arrow leaving $3$ both say $f(3) = 9$. Tables are how measured data usually arrive, such as a temperature recorded every hour, and mapping diagrams make it easy to see at a glance whether every input has exactly one output. In this lesson we read values and solve equations from tables, and decide from a mapping diagram whether it shows a function.`,
    `函数是给每个输入恰好一个输出的规则。到目前为止，规则都以公式给出，例如 $f(x) = 2x + 3$。但函数本质上就是它的输入–输出数对，不用公式也能表示这些数对。数值表把每个输入写在它的输出上方：

$$\\begin{array}{c|cccc} x & 1 & 2 & 3 & 4 \\\\ \\hline f(x) & 5 & 7 & 9 & 11 \\end{array}$$

**映射图**把同样的数对画成箭头，从每个输入指向它的输出：

{{figure 0}}

两者表示同一个函数：$3$ 下面的那一列和从 $3$ 出发的箭头都说明 $f(3) = 9$。测量得到的数据通常就是表格的形式，比如每小时记录一次的气温；映射图则让人一眼看出是否每个输入都恰好有一个输出。这节课先从数值表读函数值、解方程，再根据映射图判断它是否表示函数。`,
  ),
  introFigures: [
    mappingFigure(
      [
        [1, 5],
        [2, 7],
        [3, 9],
        [4, 11],
      ],
      "A mapping diagram of the same function: arrows 1 → 5, 2 → 7, 3 → 9, 4 → 11.",
      "同一个函数的映射图：箭头 1 → 5、2 → 7、3 → 9、4 → 11。",
    ),
  ],
  knowledgePoints: [
    {
      id: "tables-of-values",
      title: t("Tables of values", "数值表"),
      explanation: t(
        `In a **table of values**, each column is one input–output pair: the input in the $x$ row, and its output directly below it in the $f(x)$ row.

$$\\begin{array}{c|cccc} x & -1 & 0 & 2 & 5 \\\\ \\hline f(x) & 6 & 3 & -1 & 0 \\end{array}$$

The two questions about a function use the two rows in opposite directions.

- $f(2)$ gives the **input** $2$. Find $2$ in the $x$ row and read down: $f(2) = -1$.
- $f(x) = 0$ gives the **output** $0$. Find $0$ in the $f(x)$ row and read up: $x = 5$, because the column holds $f(5) = 0$.

> **Watch out.** Decide first which row the given number belongs to. In $f(2)$, the $2$ is an input, so search the $x$ row; finding a $2$ in the $f(x)$ row answers a different question. And read straight down or up the same column, not from the column next to it.`,
        `在**数值表**中，每一列是一个输入–输出数对：输入在 $x$ 行，它的输出就在正下方的 $f(x)$ 行。

$$\\begin{array}{c|cccc} x & -1 & 0 & 2 & 5 \\\\ \\hline f(x) & 6 & 3 & -1 & 0 \\end{array}$$

关于函数的两类问题，正好以相反的方向使用这两行。

- $f(2)$ 给出的是**输入** $2$。在 $x$ 行找到 $2$，向下读：$f(2) = -1$。
- $f(x) = 0$ 给出的是**输出** $0$。在 $f(x)$ 行找到 $0$，向上读：$x = 5$，因为这一列表示 $f(5) = 0$。

> **注意。** 先判断已知的数属于哪一行。在 $f(2)$ 中，$2$ 是输入，要在 $x$ 行里找；在 $f(x)$ 行里找到的 $2$ 回答的是另一个问题。另外，要沿同一列向下或向上读，不要读到旁边一列。`,
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
          const y = ys[i]!;
          const swapped = xs[ys.indexOf(a)];
          return numberProblem({
            prompt: t(
              `The table shows some values of the function $${name}$.${table}Find $${name}(${a})$.`,
              `下表给出了函数 $${name}$ 的一些值。${table}求 $${name}(${a})$。`,
            ),
            answer: y,
            wrong: [ys[(i + 1) % 5]!, ...(swapped !== undefined ? [swapped] : [])],
            solution: t(
              `**Step 1: find the input.** In $${name}(${a})$ the number $${a}$ is an input, so look for it in the $x$ row. It is in column ${i + 1}.

**Step 2: read the output.** The output sits directly below it, in the $${name}(x)$ row: $${num(y)}$. So $${valueLatex(name, a, y)}$.

**Check.** Reading back up from $${num(y)}$ in that column gives the input $${a}$, so the pair is $(${a}, ${num(y)})$.`,
              `**第一步：找输入。** 在 $${name}(${a})$ 中，$${a}$ 是输入，所以在 $x$ 行里找它。它在第 ${i + 1} 列。

**第二步：读输出。** 输出就在它正下方的 $${name}(x)$ 行：$${num(y)}$。所以 $${valueLatex(name, a, y)}$。

**检验。** 从这一列的 $${num(y)}$ 向上读回去，得到输入 $${a}$，所以这个数对是 $(${a}, ${num(y)})$。`,
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
            `**Step 1: find the output.** In $${name}(x) = ${num(c)}$ the number $${num(c)}$ is an output, so look for it in the $${name}(x)$ row. It is in column ${i + 1}.

**Step 2: read the input.** The input sits directly above it, in the $x$ row: $x = ${xs[i]}$.

**Check.** The column of $${xs[i]}$ reads $${valueLatex(name, xs[i]!, c)}$, the output we were given.`,
            `**第一步：找输出。** 在 $${name}(x) = ${num(c)}$ 中，$${num(c)}$ 是输出，所以在 $${name}(x)$ 行里找它。它在第 ${i + 1} 列。

**第二步：读输入。** 输入就在它正上方的 $x$ 行：$x = ${xs[i]}$。

**检验。** $${xs[i]}$ 所在的一列给出 $${valueLatex(name, xs[i]!, c)}$，正是已知的输出。`,
          ),
        });
      },
    },
    {
      id: "mapping-diagrams",
      title: t("Mapping diagrams", "映射图"),
      explanation: t(
        `A **mapping diagram** lists the inputs on the left, the outputs on the right, and draws an arrow from each input to its output. A function gives each input exactly one output, so the diagram shows a function exactly when **every input has exactly one arrow leaving it**.

Here is a diagram of a function. Two arrows end at $5$, which only says that $1$ and $2$ have the same output:

{{figure 0}}

Here is one that is not a function. Two arrows leave the input $1$, so $1$ has two outputs, $5$ and $0$:

{{figure 1}}

> **Watch out.** Count the arrows **leaving** each input, not the arrows arriving at each output. Several arrows may arrive at one output; only an input with two arrows leaving it breaks the rule.`,
        `**映射图**在左边列出输入，在右边列出输出，并从每个输入画一个箭头指向它的输出。函数给每个输入恰好一个输出，所以当且仅当**每个输入恰好引出一个箭头**时，映射图表示函数。

下面是一个函数的映射图。有两个箭头指向 $5$，这只说明 $1$ 和 $2$ 的输出相同：

{{figure 0}}

下面这个不是函数。输入 $1$ 引出了两个箭头，所以 $1$ 有两个输出 $5$ 和 $0$：

{{figure 1}}

> **注意。** 要数的是从每个输入**引出**的箭头，而不是指向每个输出的箭头。多个箭头可以指向同一个输出；只有某个输入引出两个箭头，才违反规则。`,
      ),
      figures: [
        mappingFigure(
          [
            [1, 5],
            [2, 5],
            [3, -2],
          ],
          "A mapping diagram with arrows 1 → 5, 2 → 5, 3 → −2: one arrow leaves each input.",
          "映射图，箭头 1 → 5、2 → 5、3 → −2：每个输入引出一个箭头。",
        ),
        mappingFigure(
          [
            [1, 5],
            [1, 0],
            [3, -2],
          ],
          "A mapping diagram with arrows 1 → 5, 1 → 0, 3 → −2: two arrows leave the input 1.",
          "映射图，箭头 1 → 5、1 → 0、3 → −2：输入 1 引出两个箭头。",
          1,
        ),
      ],
      generate(rng) {
        const n = rng.int(3, 4);
        const xs = rng.sample(range(-5, 8), n).sort((a, b) => a - b);
        const outs = rng.sample(range(-9, 9), 3);
        const rows: Point[] = xs.map((x) => [x, rng.pick(outs)]);
        const isFunction = rng.bool();
        let note: Text;
        let marked: number | undefined;
        const count = t(
          `**Step 1: count the arrows leaving each input.** The inputs are $${xs.join(", ")}$. A function needs exactly one arrow leaving each of them.`,
          `**第一步：数每个输入引出的箭头。** 输入是 $${xs.join(", ")}$。函数要求每个输入恰好引出一个箭头。`,
        );
        if (isFunction) {
          const shared = rows.some(([, y], i) => rows.findIndex((r) => r[1] === y) !== i);
          note = t(
            `**Step 2: decide.** Each input has exactly one arrow leaving it, so the diagram shows a function.${shared ? " Some arrows end at the same output, which is allowed." : ""}`,
            `**第二步：判断。** 每个输入恰好引出一个箭头，所以映射图表示函数。${shared ? "有些箭头指向同一个输出，这是允许的。" : ""}`,
          );
        } else {
          const i = rng.int(0, n - 1);
          const [x, y] = rows[i]!;
          const other = outs.find((o) => o !== y)!;
          rows.splice(i + 1, 0, [x, other]);
          marked = x;
          note = t(
            `**Step 2: decide.** Two arrows leave the input $${x}$, to $${y}$ and to $${other}$. One input with two outputs means the diagram does not show a function.`,
            `**第二步：判断。** 输入 $${x}$ 引出了两个箭头，分别指向 $${y}$ 和 $${other}$。一个输入有两个输出，所以映射图不表示函数。`,
          );
        }
        const diagram = `$$\\begin{array}{rcl} ${rows.map(([x, y]) => `${x} & \\longmapsto & ${y}`).join(" \\\\ ")} \\end{array}$$`;
        const inputs = rows.map(([x]) => x);
        const suspect = inputs.find((x, i) => inputs.indexOf(x) !== i) ?? rng.pick(inputs);
        return {
          ...verdictChoice(rng, {
            prompt: t(`Does this mapping diagram show a function?${diagram}`, `这个映射图表示函数吗？${diagram}`),
            holds: isFunction,
            yes: t("every input has exactly one arrow leaving it", "每个输入恰好引出一个箭头"),
            no: t(`two arrows leave the input $${suspect}$`, `输入 $${suspect}$ 引出了两个箭头`),
            yesWrong: t("every input has at least one arrow leaving it", "每个输入至少引出一个箭头"),
            noWrong: t("two arrows end at the same output", "有两个箭头指向同一个输出"),
            solution: t(`${count.en}\n\n{{figure 0}}\n\n${note.en}`, `${count["zh-CN"]}\n\n{{figure 0}}\n\n${note["zh-CN"]}`),
          }),
          solutionFigures: [
            mappingFigure(
              rows,
              `The diagram drawn with ovals: ${arrowsAlt(rows).en}.`,
              `画成椭圆的映射图：${arrowsAlt(rows)["zh-CN"]}。`,
              marked,
            ),
          ],
        };
      },
    },
  ],
};

// Topic: graphs of functions.

/** parabolaPoints are the points of the table of x² − 4 that opens the topic of graphs. */
const parabolaPoints: readonly Point[] = [
  [-3, 5],
  [-2, 0],
  [-1, -3],
  [0, -4],
  [1, -3],
  [2, 0],
  [3, 5],
];

/** sampleGraph is the graph through (−4, 1), (−1, 4), (2, −3), (5, 0) that the explanations of graphs read from. */
const sampleGraph: readonly Point[] = [
  [-4, 1],
  [-1, 4],
  [2, -3],
  [5, 0],
];

/** temperatureGraph is the temperature through (−5, 2), (−2, −2), (1, 5), (4, 1) that the introductions of graphs read from. */
const temperatureGraph: readonly Point[] = [
  [-5, 2],
  [-2, -2],
  [1, 5],
  [4, 1],
];

export const graphsOfFunctions: TopicDef = {
  id: "graphs-of-functions",
  title: t("Graphs of Functions", "函数的图象"),
  summary: t(
    "Read values of a function from its graph, solve equations from a graph, and check points against a formula.",
    "从图象读出函数值，借助图象解方程，并判断点是否在函数图象上。",
  ),
  prerequisites: ["representations-of-functions", "the-coordinate-plane"],
  encompasses: [],
  xp: 14,
  standards: ["CCSS.HSF.IF.A.2", "CCSS.HSA.REI.D.10"],
  intro: t(
    `A table of values lists input–output pairs, and in the coordinate plane every pair $(x, y)$ is a point. Put the two together: each column of a table becomes a point whose $x$-coordinate is the input and whose $y$-coordinate is the output. Here is a table of $f(x) = x^{2} - 4$:

$$\\begin{array}{c|ccccccc} x & -3 & -2 & -1 & 0 & 1 & 2 & 3 \\\\ \\hline f(x) & 5 & 0 & -3 & -4 & -3 & 0 & 5 \\end{array}$$

and its columns plotted as points:

{{figure 0}}

A table can only list some inputs, but the formula works for every input in between. Plotting the points for **all** inputs fills in a smooth curve, the **graph** of $f$:

{{figure 1}}

So the graph of $f$ is the set of all points $(x, f(x))$. Its height above or below the input $x$ is the output $f(x)$. This turns questions about a function into questions about a picture. In this lesson we read outputs off a graph, solve equations by looking for a height, and test whether a point lies on the graph of a formula.`,
    `数值表列出输入–输出数对，而在坐标平面中，每个数对 $(x, y)$ 都是一个点。把两者结合起来：表中的每一列都变成一个点，它的 $x$ 坐标是输入，$y$ 坐标是输出。下面是 $f(x) = x^{2} - 4$ 的数值表：

$$\\begin{array}{c|ccccccc} x & -3 & -2 & -1 & 0 & 1 & 2 & 3 \\\\ \\hline f(x) & 5 & 0 & -3 & -4 & -3 & 0 & 5 \\end{array}$$

把各列描成点：

{{figure 0}}

表格只能列出部分输入，但公式对其间的每个输入都适用。把**所有**输入对应的点都描出来，就连成一条光滑的曲线，即 $f$ 的**图象**：

{{figure 1}}

所以 $f$ 的图象是所有点 $(x, f(x))$ 组成的集合。图象在输入 $x$ 处的高度就是输出 $f(x)$。这样，关于函数的问题就变成了关于图形的问题。这节课先从图象读出输出，再通过找高度来解方程，最后判断一个点是否在由公式给出的函数图象上。`,
  ),
  introFigures: [
    {
      svg: plane(
        view,
        parabolaPoints.map((p): PlaneMark => ({ kind: "point", at: p, accent: true })),
      ),
      alt: t(
        "The seven points (−3, 5), (−2, 0), (−1, −3), (0, −4), (1, −3), (2, 0), (3, 5) plotted in the plane.",
        "在平面上描出七个点 (−3, 5)、(−2, 0)、(−1, −3)、(0, −4)、(1, −3)、(2, 0)、(3, 5)。",
      ),
    },
    {
      svg: plane(view, [
        { kind: "curve", f: (x) => x * x - 4, accent: true },
        ...parabolaPoints.map((p): PlaneMark => ({ kind: "point", at: p, accent: true })),
      ]),
      alt: t(
        "The graph of f(x) = x² − 4: a U-shaped curve through the seven points, lowest at (0, −4).",
        "f(x) = x² − 4 的图象：经过这七个点的 U 形曲线，最低点是 (0, −4)。",
      ),
    },
  ],
  knowledgePoints: [
    {
      id: "reading-values-from-a-graph",
      figure: gradeDrawings5["graphs-of-functions#reading-values-from-a-graph"],
      title: t("Reading values from a graph", "从图象读函数值"),
      explanation: t(
        `The **graph** of a function $f$ is the set of points $(x, f(x))$: above or below each input $x$, the graph sits at the height $f(x)$. So to find $f(a)$, find the point of the graph whose first coordinate is $a$, and read its second coordinate.

In practice: go to $a$ on the $x$-axis, move straight up or down until you reach the graph, then move across to the $y$-axis and read the number there. On this graph, from $x = 2$ we move down to the point $(2, -3)$, so $f(2) = -3$:

{{figure 0}}

> **Watch out.** The input is found on the $x$-axis and the output read on the $y$-axis. Finding $2$ on the $y$-axis and reading across answers "which input gives $2$?", a different question. And the answer is the height $-3$, not the $x$-value $2$ you started from.`,
        `函数 $f$ 的**图象**是所有点 $(x, f(x))$ 组成的集合：在每个输入 $x$ 的正上方或正下方，图象的高度是 $f(x)$。所以求 $f(a)$，就是找图象上第一个坐标为 $a$ 的点，读出它的第二个坐标。

具体做法：在 $x$ 轴上找到 $a$，竖直向上或向下移动到图象，再水平移到 $y$ 轴读数。在这个图象上，从 $x = 2$ 向下到达点 $(2, -3)$，所以 $f(2) = -3$：

{{figure 0}}

> **注意。** 输入在 $x$ 轴上找，输出在 $y$ 轴上读。在 $y$ 轴上找 $2$ 再水平读，回答的是"哪个输入的输出是 $2$"，是另一个问题。另外，答案是高度 $-3$，不是出发时的 $x$ 值 $2$。`,
      ),
      figures: [
        {
          svg: plane(view, [...pieceMarks([{ pts: sampleGraph }]), ...guides([2, -3], "(2, −3)")]),
          alt: t(
            "A graph through (−4, 1), (−1, 4), (2, −3), (5, 0). Dashed guides go from x = 2 down to the point (2, −3) and across to −3 on the y-axis.",
            "经过 (−4, 1)、(−1, 4)、(2, −3)、(5, 0) 的图象。虚线从 x = 2 向下到达点 (2, −3)，再水平到 y 轴上的 −3。",
          ),
        },
      ],
      generate(rng) {
        const name = rng.pick(names);
        const pts = walk(rng, -5, 5, -5, 5, 4);
        const i = rng.int(0, pts.length - 1);
        const [a, y] = pts[i]!;
        const swapped = pts.find((p) => p[1] === a)?.[0];
        const move =
          y === 0
            ? t("The graph meets the $x$-axis right there,", "不用移动：图象正好在这里与 $x$ 轴相交")
            : y > 0
              ? t("Move up until you reach the graph,", "竖直向上移动，直到碰到图象")
              : t("Move down until you reach the graph,", "竖直向下移动，直到碰到图象");
        return annotate(
          {
            ...numberProblem({
              prompt: t(`The graph of $${name}$ is shown. Find $${name}(${a})$.`, `如图是 $${name}$ 的图象。求 $${name}(${a})$。`),
              answer: y,
              wrong: [pts[(i + 1) % pts.length]![1], ...(swapped !== undefined ? [swapped] : []), a],
              solution: t(
                `**Step 1: find the input.** $${name}(${a})$ is the output for the input $${a}$, so start at $x = ${a}$ on the $x$-axis.

**Step 2: go to the graph.** ${move.en} at the point $(${a}, ${y})$.

**Step 3: read the height.** Its $y$-coordinate is $${y}$, so $${valueLatex(name, a, y)}$.

**Check.** The point $(${a}, ${y})$ has the input $${a}$ as its first coordinate, so it is the point $(${a}, ${name}(${a}))$ of the graph.`,
                `**第一步：找输入。** $${name}(${a})$ 是输入 $${a}$ 的输出，所以从 $x$ 轴上的 $x = ${a}$ 出发。

**第二步：到达图象。** ${move["zh-CN"]}，在点 $(${a}, ${y})$ 处。

**第三步：读高度。** 它的 $y$ 坐标是 $${y}$，所以 $${valueLatex(name, a, y)}$。

**检验。** 点 $(${a}, ${y})$ 的第一个坐标是输入 $${a}$，所以它就是图象上的点 $(${a}, ${name}(${a}))$。`,
              ),
            }),
            figure: graphFigure([{ pts }], name),
          },
          view,
          guides([a, y], spot([a, y])),
          `At x = ${a} the graph is at height ${y}.`,
          `当 x = ${a} 时，图象的高度是 ${y}。`,
        );
      },
    },
    {
      id: "solving-equations-from-a-graph",
      figure: gradeDrawings5["graphs-of-functions#solving-equations-from-a-graph"],
      title: t("Solving equations from a graph", "借助图象解方程"),
      explanation: t(
        `To solve $f(x) = c$ we need every input whose output is $c$. On the graph, an output of $c$ is a point at height $c$, and all points at height $c$ lie on the horizontal line $y = c$. So draw that line: each place where it meets the graph is a point $(x, c)$ with $f(x) = c$, and its $x$-coordinate is a solution.

On this graph, the line $y = 1$ meets the graph at $(-4, 1)$ and at $(0, 1)$, and nowhere else, so $f(x) = 1$ has the two solutions $x = -4$ and $x = 0$:

{{figure 0}}

The line can meet the graph once, several times, or not at all, so an equation like this can have one solution, several, or none.

> **Watch out.** The solutions are the $x$-coordinates of the meeting points, not the height $c$ itself. And sweep along the whole line: stopping at the first meeting point loses the other solutions.`,
        `解 $f(x) = c$，就是要找出所有输出为 $c$ 的输入。在图象上，输出为 $c$ 的点高度是 $c$，而所有高度为 $c$ 的点都在水平直线 $y = c$ 上。所以画出这条直线：它与图象的每个交点都是一个满足 $f(x) = c$ 的点 $(x, c)$，交点的 $x$ 坐标就是一个解。

在这个图象上，直线 $y = 1$ 与图象交于 $(-4, 1)$ 和 $(0, 1)$，别处没有交点，所以 $f(x) = 1$ 有两个解 $x = -4$ 和 $x = 0$：

{{figure 0}}

这条直线可能与图象交一次、交多次，也可能不相交，所以这类方程可能有一个解、多个解，也可能无解。

> **注意。** 解是交点的 $x$ 坐标，不是高度 $c$ 本身。另外，要沿整条直线看一遍：只找到第一个交点就停下，会漏掉其他的解。`,
      ),
      figures: [
        {
          svg: plane(view, [
            ...pieceMarks([
              {
                pts: [
                  [-5, -2],
                  [-4, 1],
                  [-2, 4],
                  [0, 1],
                  [3, -4],
                  [5, -1],
                ],
              },
            ]),
            ...level(1, [-4, 0]),
          ]),
          alt: t(
            "A graph through (−5, −2), (−4, 1), (−2, 4), (0, 1), (3, −4), (5, −1), with the dashed line y = 1 meeting it at (−4, 1) and (0, 1).",
            "经过 (−5, −2)、(−4, 1)、(−2, 4)、(0, 1)、(3, −4)、(5, −1) 的图象，虚线 y = 1 与它交于 (−4, 1) 和 (0, 1)。",
          ),
        },
      ],
      generate(rng) {
        const name = rng.pick(names);
        const c = rng.int(-3, 3);
        const { pts, hits } = levelWalk(rng, c, -5, 5);
        const wrong: string[][] = [[String(c)]];
        if (hits.length > 1) wrong.push(hits.slice(1).map(String), hits.slice(0, -1).map(String));
        const many = hits.length > 1;
        return annotate(
          {
            ...solutionsProblem({
              prompt: t(
                `The graph of $${name}$ is shown. Solve $${name}(x) = ${c}$.`,
                `如图是 $${name}$ 的图象。解方程 $${name}(x) = ${c}$。`,
              ),
              values: hits.map(String),
              wrong,
              solution: t(
                `**Step 1: draw the level.** An output of $${c}$ is a height of $${c}$, so imagine the horizontal line $y = ${c}$ across the graph.

**Step 2: find the meeting points.** Following the line from left to right, it meets the graph ${many ? `${hits.length} times` : "once"}: at ${hits.map((x) => `$(${x}, ${c})$`).join(" and ")}.

**Step 3: read the inputs.** The solutions are the $x$-coordinates: ${hits.map((x) => `$x = ${x}$`).join(" or ")}.

**Check.** At ${many ? "each of these inputs" : "this input"} the graph is at height $${c}$: ${hits.map((x) => `$${valueLatex(name, x, c)}$`).join(" and ")}.`,
                `**第一步：画出高度线。** 输出为 $${c}$ 就是高度为 $${c}$，所以设想一条水平直线 $y = ${c}$ 穿过图象。

**第二步：找交点。** 沿这条直线从左往右看，它与图象${many ? `相交 ${hits.length} 次` : "相交一次"}：在 ${hits.map((x) => `$(${x}, ${c})$`).join(" 和 ")} 处。

**第三步：读输入。** 解是这些点的 $x$ 坐标：${hits.map((x) => `$x = ${x}$`).join(" 或 ")}。

**检验。** 在${many ? "这些输入" : "这个输入"}处，图象的高度都是 $${c}$：${hits.map((x) => `$${valueLatex(name, x, c)}$`).join("，")}。`,
              ),
            }),
            figure: graphFigure([{ pts }], name),
          },
          view,
          level(c, hits),
          `The graph meets y = ${c} at x = ${hits.join(", ")}.`,
          `图象与 y = ${c} 交于 x = ${hits.join("、")}。`,
        );
      },
    },
    {
      id: "points-on-a-graph",
      figure: gradeDrawings5["graphs-of-functions#points-on-a-graph"],
      title: t("Points on the graph of a formula", "点是否在函数图象上"),
      explanation: t(
        `The graph of $f$ is made of the points $(x, f(x))$, so a point $(a, b)$ is on it exactly when its height $b$ is the output for its input $a$: when $f(a) = b$. To test a point, put its first coordinate into the formula and compare the result with its second coordinate.

For $f(x) = 2x^{2} - 1$:

- $(2, 7)$: $f(2) = 2(2)^{2} - 1 = 7$, which matches the second coordinate, so the point is on the graph.
- $(7, 2)$: $f(7) = 2(7)^{2} - 1 = 97$, not $2$, so the point is not on the graph.

> **Watch out.** The first coordinate is the input and the second the output. Substituting the second coordinate for $x$ tests the swapped point $(b, a)$ instead, as $(7, 2)$ and $(2, 7)$ show.`,
        `$f$ 的图象由点 $(x, f(x))$ 组成，所以点 $(a, b)$ 在图象上，当且仅当它的高度 $b$ 正是输入 $a$ 的输出，即 $f(a) = b$。要检验一个点，就把它的第一个坐标代入公式，把结果与第二个坐标比较。

对于 $f(x) = 2x^{2} - 1$：

- $(2, 7)$：$f(2) = 2(2)^{2} - 1 = 7$，与第二个坐标相同，所以这个点在图象上。
- $(7, 2)$：$f(7) = 2(7)^{2} - 1 = 97$，不是 $2$，所以这个点不在图象上。

> **注意。** 第一个坐标是输入，第二个坐标是输出。把第二个坐标代入 $x$，检验的就成了交换后的点 $(b, a)$，$(7, 2)$ 和 $(2, 7)$ 就是例子。`,
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
            `**Step 1: find the output for the first coordinate.** The point has the input $${pt[0]}$, so evaluate $${name}(${pt[0]})$:${evaluation(name, p, pt[0])}**Step 2: compare with the second coordinate.** ${on ? `The output $${num(value)}$ equals the second coordinate $${pt[1]}$, so the point is on the graph.` : `The output $${num(value)}$ is not the second coordinate $${pt[1]}$, so the point is not on the graph: the graph passes through $(${pt[0]}, ${num(value)})$ instead.`}`,
            `**第一步：求第一个坐标对应的输出。** 这个点的输入是 $${pt[0]}$，所以计算 $${name}(${pt[0]})$：${evaluation(name, p, pt[0])}**第二步：与第二个坐标比较。** ${on ? `输出 $${num(value)}$ 等于第二个坐标 $${pt[1]}$，所以这个点在图象上。` : `输出 $${num(value)}$ 不等于第二个坐标 $${pt[1]}$，所以这个点不在图象上：图象经过的是 $(${pt[0]}, ${num(value)})$。`}`,
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

/** pieceEnds describes where a piece of a graph starts and ends on the x-axis, and whether each end is included. */
function pieceEnds(p: Piece): Text {
  const [x0, x1] = [p.pts[0]![0], p.pts[p.pts.length - 1]![0]];
  const end = (x: number, open: boolean | undefined) =>
    open
      ? t(`an open dot at $x = ${x}$ (so $${x}$ is left out)`, `$x = ${x}$ 处的空心点（不含 $${x}$）`)
      : t(`a filled dot at $x = ${x}$ (so $${x}$ is included)`, `$x = ${x}$ 处的实心点（包含 $${x}$）`);
  const [a, b] = [end(x0, p.openStart), end(x1, p.openEnd)];
  const set = intervalLatex(union(iv(x0, x1, !p.openStart, !p.openEnd)));
  return t(`from ${a.en} to ${b.en}: $${set}$`, `从${a["zh-CN"]}到${b["zh-CN"]}：$${set}$`);
}

export const domainOfAFunction: TopicDef = {
  id: "domain-of-a-function",
  title: t("The Domain of a Function", "函数的定义域"),
  summary: t(
    "Find the domain of a function from a set of pairs, a graph or a formula, and write it in interval notation.",
    "由数对集合、图象或公式求函数的定义域，并用区间表示。",
  ),
  prerequisites: ["graphs-of-functions", "unions-of-intervals", "square-roots-and-cube-roots"],
  encompasses: [{ topic: "unbounded-intervals", weight: 0.2 }],
  xp: 16,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.B.5"],
  intro: t(
    `A function gives each input one output, but not every number has to be an input. Try a few inputs in $g(x) = \\sqrt{x - 2}$:

$$g(6) = \\sqrt{4} = 2, \\qquad g(2) = \\sqrt{0} = 0, \\qquad g(1) = \\sqrt{-1}\\ ?$$

There is no real number whose square is $-1$, so $g(1)$ does not exist: $1$ is not an allowed input. The inputs that work are exactly those with $x - 2 \\ge 0$, that is $x \\ge 2$. The set of allowed inputs of a function is its **domain**; here it is $[2, \\infty)$.

On the graph the domain is easy to see. Each input $x$ that works gives a point $(x, g(x))$ above or below it, so the domain is the part of the $x$-axis that the graph covers, its shadow on the axis:

{{figure 0}}

Knowing the domain tells us which questions about a function make sense. In this lesson we find domains from sets of pairs, from graphs and from formulas, and write them in interval notation.`,
    `函数给每个输入一个输出，但并不是每个数都必须是输入。在 $g(x) = \\sqrt{x - 2}$ 中试几个输入：

$$g(6) = \\sqrt{4} = 2, \\qquad g(2) = \\sqrt{0} = 0, \\qquad g(1) = \\sqrt{-1}\\ ?$$

没有哪个实数的平方是 $-1$，所以 $g(1)$ 不存在：$1$ 不是允许的输入。能用的输入恰好是满足 $x - 2 \\ge 0$ 的数，即 $x \\ge 2$。函数所有允许的输入组成的集合叫做它的**定义域**；这里是 $[2, \\infty)$。

在图象上，定义域一目了然。每个能用的输入 $x$ 在它的正上方或正下方给出一个点 $(x, g(x))$，所以定义域就是图象覆盖的那部分 $x$ 轴，即图象在 $x$ 轴上的"影子"：

{{figure 0}}

知道了定义域，就知道关于函数的哪些问题有意义。这节课分别由数对集合、图象和公式求定义域，并用区间表示。`,
  ),
  introFigures: [
    {
      svg: plane(view, [
        { kind: "curve", f: (x) => Math.sqrt(x - 2), from: 2, accent: true },
        { kind: "point", at: [2, 0], accent: true },
        ...onAxis("x", union(iv(2, undefined)), 6),
      ]),
      alt: t(
        "The graph of g(x) = √(x − 2), starting at (2, 0) and rising to the right; its shadow on the x-axis, from 2 to the right, is marked.",
        "g(x) = √(x − 2) 的图象，从 (2, 0) 出发向右上升；它在 x 轴上的影子，从 2 向右，已标出。",
      ),
    },
  ],
  knowledgePoints: [
    {
      id: "domain-of-a-set-of-pairs",
      title: t("The domain of a set of pairs", "数对集合的定义域"),
      explanation: t(
        `The **domain** of a function is the set of all its inputs. When the function is a set of ordered pairs $(x, y)$, every pair is an input with its output, so the inputs are exactly the **first coordinates**.

For $\\{(-1, 4), (2, 0), (5, 4)\\}$, read the first coordinate of each pair: $-1$, $2$, $5$. The domain is $\\{-1, 2, 5\\}$, written in increasing order.

The set of second coordinates, $\\{0, 4\\}$, is the **range**: the set of outputs. The output $4$ appears twice but is listed once, since a set does not repeat its members.

> **Watch out.** The domain takes only first coordinates. Listing second coordinates gives the range, and mixing both is neither. Take the first coordinate of **every** pair, so that no input is left out.`,
        `函数的**定义域**是它所有输入组成的集合。当函数是有序数对 $(x, y)$ 的集合时，每个数对都是一个输入和它的输出，所以输入恰好是所有的**第一个坐标**。

对于 $\\{(-1, 4), (2, 0), (5, 4)\\}$，读出每个数对的第一个坐标：$-1$、$2$、$5$。定义域是 $\\{-1, 2, 5\\}$，按从小到大的顺序写出。

所有第二个坐标组成的集合 $\\{0, 4\\}$ 是**值域**，即所有输出组成的集合。输出 $4$ 出现了两次，但只写一次，因为集合中的元素不重复。

> **注意。** 定义域只取第一个坐标。列出第二个坐标得到的是值域，两者混在一起则什么都不是。要取**每一个**数对的第一个坐标，不能漏掉输入。`,
      ),
      generate(rng) {
        const n = rng.int(3, 5);
        const xs = rng.sample(range(-6, 9), n);
        const ys = xs.map(() => rng.int(-9, 9));
        if (rng.bool()) ys[n - 1] = ys[0]!;
        const ps = rng.shuffle(xs.map((x, i): Point => [x, ys[i]!]));
        const candidates = [setOf(xs), setOf(ys), setOf([...xs, ...ys]), setOf(xs.slice(1))].filter((s, i, all) => all.indexOf(s) === i);
        const options = rng.shuffle(candidates);
        const firsts = ps.map(([x]) => num(x)).join(", ");
        return reasoned(
          choiceProblem({
            prompt: t(`What is the domain of the function $${pairs(ps)}$?`, `函数 $${pairs(ps)}$ 的定义域是什么？`),
            options: options.map((s) => same(`$${s}$`)),
            correct: options.indexOf(setOf(xs)),
            solution: t(
              `**Step 1: read the inputs.** The domain is the set of inputs, and each pair lists its input first. The first coordinates, pair by pair, are $${firsts}$.

**Step 2: write them as a set.** In increasing order, the domain is $${setOf(xs)}$.

**Check.** The set has ${n} members, one for each of the ${n} pairs, and every pair starts with one of them.`,
              `**第一步：读出输入。** 定义域是所有输入组成的集合，而每个数对的第一个数就是输入。逐个读出第一个坐标：$${firsts}$。

**第二步：写成集合。** 按从小到大的顺序，定义域是 $${setOf(xs)}$。

**检验。** 这个集合有 ${n} 个元素，与 ${n} 个数对一一对应，每个数对的第一个数都在其中。`,
            ),
          }),
          [
            [
              `$${setOf(ys)}$`,
              "Those are the second coordinates, the outputs: that set is the range.",
              "这些是第二个坐标，即输出：它们组成的是值域。",
            ],
            [
              `$${setOf([...xs, ...ys])}$`,
              "This mixes in outputs: only first coordinates belong in the domain.",
              "这里混入了输出：定义域只包含第一个坐标。",
            ],
            [
              `$${setOf(xs.slice(1))}$`,
              "This leaves out an input: the first coordinate of every pair counts.",
              "这里漏掉了一个输入：每一对的第一个坐标都要算。",
            ],
          ],
        );
      },
    },
    {
      id: "domain-from-a-graph",
      figure: algebraDrawings["domain-of-a-function#domain-from-a-graph"],
      title: t("The domain from a graph", "由图象求定义域"),
      explanation: t(
        `An input $x$ is in the domain exactly when the graph has a point straight above or below it. So the domain is the set of $x$-values the graph covers: look at how far it reaches **left and right**, and ignore how high or low it goes.

At an end of the graph, the dot decides: a **filled** dot belongs to the graph, so its $x$-value is in the domain; an **open** dot does not. In **interval notation**, a square bracket $[\\;]$ includes an endpoint and a parenthesis $(\\;)$ excludes it.

This graph starts with a filled dot at $x = -3$ and ends with an open dot at $x = 4$, so its domain is $[-3, 4)$, that is $-3 \\le x < 4$:

{{figure 0}}

If the graph has a gap, each part gives an interval, and the domain joins them with $\\cup$ (union), such as $[-5, -1] \\cup (2, 5]$.

> **Watch out.** The domain is read along the $x$-axis; the $y$-values the graph reaches form the range. Copy each end's dot faithfully, a bracket for filled and a parenthesis for open. And do not bridge a gap: the $x$-values between two parts have no point of the graph.`,
        `输入 $x$ 属于定义域，当且仅当图象在它的正上方或正下方有点。所以定义域是图象覆盖的所有 $x$ 值：看图象**向左和向右**延伸到哪里，不用管它有多高或多低。

在图象的端点处，由点来决定：**实心**点属于图象，所以它的 $x$ 值在定义域中；**空心**点不属于。在**区间**记号中，方括号 $[\\;]$ 包含端点，圆括号 $(\\;)$ 不包含端点。

这个图象从 $x = -3$ 处的实心点开始，到 $x = 4$ 处的空心点结束，所以定义域是 $[-3, 4)$，即 $-3 \\le x < 4$：

{{figure 0}}

如果图象中间断开，每一部分给出一个区间，定义域用 $\\cup$（并集）把它们连起来，例如 $[-5, -1] \\cup (2, 5]$。

> **注意。** 定义域沿 $x$ 轴读；图象达到的 $y$ 值组成的是值域。每个端点的点要照实转写：实心用方括号，空心用圆括号。另外，不要跨过缺口：两部分之间的 $x$ 值上没有图象的点。`,
      ),
      figures: [
        {
          svg: plane(view, [
            ...pieceMarks([
              {
                pts: [
                  [-3, 2],
                  [0, -2],
                  [2, 3],
                  [4, 1],
                ],
                openEnd: true,
              },
            ]),
            ...onAxis("x", union(iv(-3, 4, true, false)), 6),
          ]),
          alt: t(
            "A graph through (−3, 2), (0, −2), (2, 3), (4, 1), with a filled dot at (−3, 2) and an open dot at (4, 1). The x-values from −3, included, to 4, excluded, are marked on the x-axis.",
            "经过 (−3, 2)、(0, −2)、(2, 3)、(4, 1) 的图象，(−3, 2) 处为实心点，(4, 1) 处为空心点。x 轴上标出了从 −3（含）到 4（不含）的 x 值。",
          ),
        },
      ],
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
        const two = pieces.length === 2;
        const [p, q] = [pieces[0]!, pieces[1]];
        const last = pieces[pieces.length - 1]!;
        const right = last.pts[last.pts.length - 1]![0];
        const ends = two
          ? t(
              `**Step 1: read each part.** The graph has two parts. The left part runs ${pieceEnds(p).en}. The right part runs ${pieceEnds(q!).en}.

**Step 2: join the parts.** The $x$-values between the parts have no point of the graph, so the domain is the union ${setText(domain)}.`,
              `**第一步：分别读出每一部分。** 图象有两部分。左边部分${pieceEnds(p)["zh-CN"]}。右边部分${pieceEnds(q!)["zh-CN"]}。

**第二步：合并各部分。** 两部分之间的 $x$ 值上没有图象的点，所以定义域是并集 ${setText(domain)}。`,
            )
          : t(
              `**Step 1: read the ends.** Ignoring the heights, the graph runs ${pieceEnds(p).en}.

**Step 2: write the interval.** The graph is in one piece, so it covers every $x$-value between its ends: the domain is ${setText(domain)}.`,
              `**第一步：读出两端。** 不看高度，图象${pieceEnds(p)["zh-CN"]}。

**第二步：写出区间。** 图象是连在一起的一段，所以覆盖两端之间的每个 $x$ 值：定义域是 ${setText(domain)}。`,
            );
        const gap = num(two ? Q.of(p.pts[p.pts.length - 1]![0] + q!.pts[0]![0], 2) : right + 1);
        return annotate(
          {
            ...intervalProblem({
              prompt: t(
                `The graph of $${name}$ is shown. Find the domain of $${name}$.`,
                `如图是 $${name}$ 的图象。求 $${name}$ 的定义域。`,
              ),
              set: domain,
              wrong: [rangeOf(pieces), withEnds(domain, true), withEnds(domain, false), hull(domain)],
              solution: t(
                `${ends.en}

**Check.** The vertical line $x = ${gap}$ misses the graph, and $${gap}$ is indeed outside ${setText(domain)}.`,
                `${ends["zh-CN"]}

**检验。** 竖直线 $x = ${gap}$ 与图象不相交，而 $${gap}$ 确实不在 ${setText(domain)} 中。`,
              ),
            }),
            figure: graphFigure(pieces, name),
          },
          view,
          onAxis("x", domain, 6),
          `The graph covers x in ${setAlt(domain)}.`,
          `图象覆盖的 x 是 ${setAlt(domain)}。`,
        );
      },
    },
    {
      id: "domain-from-a-formula",
      title: t("The domain from a formula", "由公式求定义域"),
      explanation: t(
        `When a function is given by a formula alone, its domain is every real number for which the formula can be worked out. Adding, subtracting and multiplying always work, so only two operations can fail:

- **Division by zero.** $f(x) = \\dfrac{5}{x - 2}$ cannot be worked out when the denominator is $0$. Solving $x - 2 = 0$ gives $x = 2$, the one number to leave out: the domain is $(-\\infty, 2) \\cup (2, \\infty)$.
- **The square root of a negative number.** $g(x) = \\sqrt{x + 3}$ needs $x + 3 \\ge 0$. Solving gives $x \\ge -3$, and $-3$ itself is allowed since $\\sqrt{0} = 0$: the domain is $[-3, \\infty)$.

A polynomial such as $x^{2} - 4x$ uses only multiplication and addition, so its domain is every real number: $(-\\infty, \\infty)$, also written $\\mathbb{R}$. The symbol $\\infty$ is not a number, so it always takes a parenthesis.

> **Watch out.** Solve for the number to exclude; do not read it off the formula with its sign. $x - 2$ is zero at $x = 2$, not $-2$, and $3x - 6$ is zero at $x = 2$, not $6$. A zero denominator is excluded, so it takes parentheses; a root of $0$ is fine, so its endpoint takes a bracket.`,
        `如果函数只给出公式，它的定义域就是能使公式算出结果的所有实数。加、减、乘总能进行，所以只有两种运算可能出问题：

- **除以零。** 当分母为 $0$ 时，$f(x) = \\dfrac{5}{x - 2}$ 无法计算。解 $x - 2 = 0$ 得 $x = 2$，这是唯一要去掉的数：定义域是 $(-\\infty, 2) \\cup (2, \\infty)$。
- **负数开平方。** $g(x) = \\sqrt{x + 3}$ 要求 $x + 3 \\ge 0$。解得 $x \\ge -3$；$-3$ 本身也可以，因为 $\\sqrt{0} = 0$：定义域是 $[-3, \\infty)$。

像 $x^{2} - 4x$ 这样的多项式只用到乘法和加法，所以定义域是全体实数：$(-\\infty, \\infty)$，也记作 $\\mathbb{R}$。$\\infty$ 不是一个数，所以总是用圆括号。

> **注意。** 要通过解方程找出要去掉的数，不要连同符号从公式上直接照抄。$x - 2$ 在 $x = 2$ 时为零，不是 $-2$；$3x - 6$ 在 $x = 2$ 时为零，不是 $6$。分母为零的点要去掉，用圆括号；根号下为 $0$ 没有问题，所以那个端点用方括号。`,
      ),
      keyPrerequisites: ["square-roots-and-cube-roots", "inequalities-and-solutions"],
      generate(rng) {
        const name = rng.pick(names);
        const kind = rng.int(0, 5);
        const a = rng.nonZero(-8, 8);
        const b = rng.int(2, 4);
        const k = rng.nonZero(-9, 9);
        const punctured = union(iv(undefined, a, false, false), iv(a, undefined, false, false));
        const p: Poly = [rng.int(-9, 9), rng.int(-6, 6), rng.nonZero(-3, 3)];
        const den1 = linear(1, -a);
        const den2 = linear(b, -b * a);
        const rad2 = poly([a, ""], [-1, "x"]);
        const atA = (expr: string, value: string) => `$${expr.replaceAll("x", `(${a})`)} = ${value}$`;
        const cases: [string, RealSet, RealSet[], Text][] = [
          [
            polyLatex(p),
            realLine,
            [union(iv(0, undefined)), union(iv(0, undefined, false))],
            t(
              `**Step 1: look for a step that can fail.** The formula only multiplies, adds and subtracts, and those can be done for every real number. There is no division and no square root.

**Step 2: write the domain.** Every real number is allowed: the domain is ${setText(realLine)}.

**Check.** Any input can be worked out; for example $${name}(${a}) = ${substitution(p, a)} = ${num(evalPoly(p, a))}$.`,
              `**第一步：找可能出问题的运算。** 公式只用到乘、加、减，对任何实数都能进行。没有除法，也没有根号。

**第二步：写出定义域。** 所有实数都可以：定义域是 ${setText(realLine)}。

**检验。** 任何输入都能算出结果，例如 $${name}(${a}) = ${substitution(p, a)} = ${num(evalPoly(p, a))}$。`,
            ),
          ],
          [
            `\\frac{${k}}{${den1}}`,
            punctured,
            [union(iv(-a, undefined, false, false), iv(undefined, -a, false, false)), union(iv(a, undefined, false)), realLine],
            t(
              `**Step 1: find where the denominator is zero.** Division by $0$ is impossible, so solve $${den1} = 0$: $x = ${a}$.

**Step 2: leave that number out.** Every other number gives a nonzero denominator, so the domain is all real numbers except $${a}$: ${setText(punctured)}.

**Check.** At $x = ${a}$ the denominator is ${atA(den1, "0")}, so $${name}(${a})$ cannot be computed; at $x = ${a + 1}$ it is $1$ and $${name}(${a + 1}) = ${k}$.`,
              `**第一步：找出分母为零的点。** 不能除以 $0$，所以解 $${den1} = 0$：$x = ${a}$。

**第二步：去掉这个数。** 其他数都使分母不为零，所以定义域是除 $${a}$ 以外的全体实数：${setText(punctured)}。

**检验。** 当 $x = ${a}$ 时，分母为 ${atA(den1, "0")}，所以 $${name}(${a})$ 无定义；当 $x = ${a + 1}$ 时，分母为 $1$，$${name}(${a + 1}) = ${k}$。`,
            ),
          ],
          [
            `\\frac{${k}}{${den2}}`,
            punctured,
            [
              union(iv(undefined, b * a, false, false), iv(b * a, undefined, false, false)),
              union(iv(undefined, -a, false, false), iv(-a, undefined, false, false)),
              union(iv(a, undefined, false)),
            ],
            t(
              `**Step 1: find where the denominator is zero.** Division by $0$ is impossible, so solve $${den2} = 0$:${steps(`${b}x = ${num(b * a)}`, `x = ${a}`)}**Step 2: leave that number out.** Every other number gives a nonzero denominator, so the domain is all real numbers except $${a}$: ${setText(punctured)}.

**Check.** At $x = ${a}$ the denominator is $${b}(${a})${tail(-b * a)} = ${num(b * a)}${tail(-b * a)} = 0$, so $${name}(${a})$ cannot be computed.`,
              `**第一步：找出分母为零的点。** 不能除以 $0$，所以解 $${den2} = 0$：${steps(`${b}x = ${num(b * a)}`, `x = ${a}`)}**第二步：去掉这个数。** 其他数都使分母不为零，所以定义域是除 $${a}$ 以外的全体实数：${setText(punctured)}。

**检验。** 当 $x = ${a}$ 时，分母为 $${b}(${a})${tail(-b * a)} = ${num(b * a)}${tail(-b * a)} = 0$，所以 $${name}(${a})$ 无定义。`,
            ),
          ],
          [
            `\\sqrt{${den1}}`,
            union(iv(a, undefined)),
            [union(iv(a, undefined, false)), union(iv(-a, undefined)), union(iv(undefined, a))],
            t(
              `**Step 1: keep the root's inside nonnegative.** A real square root needs $${den1} \\ge 0$. ${a > 0 ? `Add $${a}$ to` : `Subtract $${-a}$ from`} both sides: $x \\ge ${a}$.

**Step 2: include the endpoint.** At $x = ${a}$ the inside is $0$, and $\\sqrt{0} = 0$ is fine, so $${a}$ is included: the domain is ${setText(union(iv(a, undefined)))}.

**Check.** $${name}(${a}) = \\sqrt{0} = 0$ works, while at $x = ${a - 1}$ the inside is $-1$, which has no real square root.`,
              `**第一步：让根号下非负。** 实数范围内开平方要求 $${den1} \\ge 0$。两边同时${a > 0 ? `加上 $${a}$` : `减去 $${-a}$`}：$x \\ge ${a}$。

**第二步：包含端点。** 当 $x = ${a}$ 时根号下为 $0$，$\\sqrt{0} = 0$ 没有问题，所以包含 $${a}$：定义域是 ${setText(union(iv(a, undefined)))}。

**检验。** $${name}(${a}) = \\sqrt{0} = 0$ 可以计算，而当 $x = ${a - 1}$ 时根号下为 $-1$，在实数范围内不能开平方。`,
            ),
          ],
          [
            `\\sqrt{${rad2}}`,
            union(iv(undefined, a)),
            [union(iv(a, undefined)), union(iv(undefined, a, false, false)), union(iv(undefined, -a))],
            t(
              `**Step 1: keep the root's inside nonnegative.** A real square root needs $${rad2} \\ge 0$. Add $x$ to both sides: $${a} \\ge x$, that is $x \\le ${a}$. The inside shrinks as $x$ grows, so the allowed inputs lie to the **left** of $${a}$.

**Step 2: include the endpoint.** At $x = ${a}$ the inside is $0$, and $\\sqrt{0} = 0$ is fine, so the domain is ${setText(union(iv(undefined, a)))}.

**Check.** $${name}(${a}) = \\sqrt{0} = 0$ works, while at $x = ${a + 1}$ the inside is $-1$, which has no real square root.`,
              `**第一步：让根号下非负。** 实数范围内开平方要求 $${rad2} \\ge 0$。两边同时加上 $x$：$${a} \\ge x$，即 $x \\le ${a}$。$x$ 越大根号下越小，所以允许的输入在 $${a}$ 的**左边**。

**第二步：包含端点。** 当 $x = ${a}$ 时根号下为 $0$，$\\sqrt{0} = 0$ 没有问题，所以定义域是 ${setText(union(iv(undefined, a)))}。

**检验。** $${name}(${a}) = \\sqrt{0} = 0$ 可以计算，而当 $x = ${a + 1}$ 时根号下为 $-1$，在实数范围内不能开平方。`,
            ),
          ],
          [
            `\\sqrt{${den2}}`,
            union(iv(a, undefined)),
            [union(iv(b * a, undefined)), union(iv(a, undefined, false)), union(iv(-a, undefined))],
            t(
              `**Step 1: keep the root's inside nonnegative.** A real square root needs $${den2} \\ge 0$:${steps(`${b}x \\ge ${num(b * a)}`, `x \\ge ${a}`)}Dividing by the positive number $${b}$ keeps the direction of the inequality.

**Step 2: include the endpoint.** At $x = ${a}$ the inside is $0$, and $\\sqrt{0} = 0$ is fine, so the domain is ${setText(union(iv(a, undefined)))}.

**Check.** At $x = ${a}$ the inside is $${b}(${a})${tail(-b * a)} = 0$, so $${name}(${a}) = 0$; at $x = ${a - 1}$ it is $-${b}$, which has no real square root.`,
              `**第一步：让根号下非负。** 实数范围内开平方要求 $${den2} \\ge 0$：${steps(`${b}x \\ge ${num(b * a)}`, `x \\ge ${a}`)}两边除以正数 $${b}$，不等号方向不变。

**第二步：包含端点。** 当 $x = ${a}$ 时根号下为 $0$，$\\sqrt{0} = 0$ 没有问题，所以定义域是 ${setText(union(iv(a, undefined)))}。

**检验。** 当 $x = ${a}$ 时根号下为 $${b}(${a})${tail(-b * a)} = 0$，所以 $${name}(${a}) = 0$；当 $x = ${a - 1}$ 时根号下为 $-${b}$，在实数范围内不能开平方。`,
            ),
          ],
        ];
        const [expr, set, wrong, solution] = cases[kind]!;
        return intervalProblem({
          prompt: t(`Find the domain of $${name}(x) = ${expr}$.`, `求 $${name}(x) = ${expr}$ 的定义域。`),
          set,
          wrong,
          solution,
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

/** Relation is a drawn graph with a vertical line x = at that shows the verdict of the test, the points where it meets the graph, and why. */
interface Relation {
  readonly figure: Figure;
  readonly at: number;
  readonly meets: readonly Point[];
  readonly why: Text;
}

/** crossings lists the points where the vertical line x = a meets a path of line segments. */
function crossings(pts: readonly Point[], a: number): Point[] {
  const out: Point[] = [];
  for (let i = 0; i + 1 < pts.length; i++) {
    const [[x0, y0], [x1, y1]] = [pts[i]!, pts[i + 1]!];
    if ((a - x0) * (a - x1) > 0 || x0 === x1) continue;
    const y = y0 + ((y1 - y0) * (a - x0)) / (x1 - x0);
    if (!out.some((p) => p[0] === a && Math.abs(p[1] - y) < 1e-9)) out.push([a, y]);
  }
  return out;
}

/** relationGraph draws a graph that is (kind < 3) or is not (kind ≥ 3) the graph of a function, with the vertical line that settles it. */
function relationGraph(rng: Rng, kind: number): Relation {
  const h = rng.int(-2, 2);
  const k = rng.int(-2, 2);
  switch (kind) {
    case 0: {
      const pts = walk(rng, rng.int(-5, -3), rng.int(3, 5), -5, 5, 4);
      return {
        figure: graphFigure([{ pts }], "a relation"),
        at: 0,
        meets: crossings(pts, 0),
        why: t(
          "The graph moves steadily to the right from one corner to the next and never doubles back, so a vertical line can cross it only once. For example, the line $x = 0$ meets it once.",
          "图形从一个拐点到下一个拐点一直向右延伸，从不折回，所以竖直线只能与它相交一次。例如直线 $x = 0$ 与它只交于一点。",
        ),
      };
    }
    case 1: {
      const s = rng.sign();
      const m = rng.pick([1, 2, 3]);
      const f = (x: number) => k + (s * (x - h) ** 2) / m;
      return {
        figure: curveFigure(
          [{ kind: "curve", f, accent: true }],
          `A parabola opening ${s > 0 ? "up" : "down"} with vertex (${h}, ${k}).`,
          `一条开口向${s > 0 ? "上" : "下"}、顶点为 (${h}, ${k}) 的抛物线。`,
        ),
        at: h + 1,
        meets: [[h + 1, f(h + 1)]],
        why: t(
          `The parabola opens ${s > 0 ? "up" : "down"}: above or below each $x$ it has exactly one point, so every vertical line meets it once. For example, the line $x = ${h + 1}$ meets it only at one height.`,
          `这条抛物线开口向${s > 0 ? "上" : "下"}：在每个 $x$ 的正上方或正下方，它恰好有一个点，所以每条竖直线都与它交于一点。例如直线 $x = ${h + 1}$ 只在一个高度与它相交。`,
        ),
      };
    }
    case 2: {
      const s = rng.pick([4, 6, 8]);
      const f = (x: number) => k + ((x - h) ** 3 - 4 * (x - h)) / s;
      return {
        figure: curveFigure(
          [{ kind: "curve", f, accent: true }],
          `An S-shaped curve through (${h}, ${k}) that rises from the lower left to the upper right.`,
          `一条经过 (${h}, ${k}) 的 S 形曲线，从左下方升到右上方。`,
        ),
        at: h,
        meets: [[h, k]],
        why: t(
          `The curve wiggles up and down, but always moves to the right, so a vertical line crosses it only once. For example, the line $x = ${h}$ meets it only at $(${h}, ${k})$.`,
          `这条曲线虽然上下起伏，但始终向右延伸，所以竖直线只与它相交一次。例如直线 $x = ${h}$ 只与它交于 $(${h}, ${k})$。`,
        ),
      };
    }
    case 3: {
      const s = rng.sign();
      const m = rng.pick([1, 2]);
      const half = (sign: number) => (x: number) => (s * (x - h) >= 0 ? k + sign * m * Math.sqrt(s * (x - h)) : Number.NaN);
      const a = h + s;
      return {
        figure: curveFigure(
          [
            { kind: "curve", f: half(1), accent: true },
            { kind: "curve", f: half(-1), accent: true },
            { kind: "segment", a: [h, k], b: [h, k], accent: true },
          ],
          `A parabola opening to the ${s > 0 ? "right" : "left"} with vertex (${h}, ${k}).`,
          `一条开口向${s > 0 ? "右" : "左"}、顶点为 (${h}, ${k}) 的抛物线。`,
        ),
        at: a,
        meets: [
          [a, k + m],
          [a, k - m],
        ],
        why: t(
          `The parabola opens to the ${s > 0 ? "right" : "left"}, so it has an upper and a lower half. The line $x = ${a}$ meets it twice, at $(${a}, ${k + m})$ and $(${a}, ${k - m})$: the input $${a}$ would have two outputs.`,
          `这条抛物线开口向${s > 0 ? "右" : "左"}，有上下两半。直线 $x = ${a}$ 与它交于两点 $(${a}, ${k + m})$ 和 $(${a}, ${k - m})$：输入 $${a}$ 会有两个输出。`,
        ),
      };
    }
    case 4: {
      const r = rng.int(2, 3);
      return {
        figure: curveFigure(
          [
            { kind: "curve", f: (x) => k + sqrt0(r * r - (x - h) ** 2), from: h - r, to: h + r, accent: true },
            { kind: "curve", f: (x) => k - sqrt0(r * r - (x - h) ** 2), from: h - r, to: h + r, accent: true },
          ],
          `A circle with center (${h}, ${k}) and radius ${r}.`,
          `一个圆心为 (${h}, ${k})、半径为 ${r} 的圆。`,
        ),
        at: h,
        meets: [
          [h, k + r],
          [h, k - r],
        ],
        why: t(
          `The line $x = ${h}$ through the center meets the circle twice, at $(${h}, ${k + r})$ at the top and $(${h}, ${k - r})$ at the bottom: the input $${h}$ would have two outputs.`,
          `过圆心的直线 $x = ${h}$ 与圆交于两点：顶部的 $(${h}, ${k + r})$ 和底部的 $(${h}, ${k - r})$。输入 $${h}$ 会有两个输出。`,
        ),
      };
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
      const a = x1 + 1;
      const meets = crossings(pts, a);
      return {
        figure: graphFigure([{ pts }], "a relation"),
        at: a,
        meets,
        why: t(
          `The graph runs right to $x = ${pts[1]![0]}$, then doubles back to the left as far as $x = ${x1}$. Over that stretch it lies above itself, so the line $x = ${a}$ meets it ${meets.length === 2 ? "twice" : `${meets.length} times`}: the input $${a}$ would have more than one output.`,
          `图形先向右延伸到 $x = ${pts[1]![0]}$，再折回向左，一直到 $x = ${x1}$。在这一段，图形上下重叠，所以直线 $x = ${a}$ 与它交于 ${meets.length} 点：输入 $${a}$ 会有不止一个输出。`,
        ),
      };
    }
  }
}

/** verticalAt draws the dashed vertical line x = a and the points where it meets a graph. */
const verticalAt = (a: number, meets: readonly Point[]): PlaneMark[] => [
  { kind: "line", a: [a, 0], b: [a, 1], dashed: true, tone: "action" },
  ...meets.map((p): PlaneMark => ({ kind: "point", at: p, tone: "result" })),
];

export const verticalLineTest: TopicDef = {
  id: "vertical-line-test",
  title: t("The Vertical Line Test", "竖直线检验"),
  summary: t("Decide from a graph whether it is the graph of a function.", "根据图象判断它是否是函数的图象。"),
  prerequisites: ["graphs-of-functions"],
  encompasses: [{ topic: "introduction-to-functions", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSF.IF.A.1"],
  intro: t(
    `A relation is a function when each input has exactly one output. For a list of pairs we checked this by looking for a repeated first coordinate. For a graph there is a quicker way to look.

All the points of the plane with input $3$ lie on one vertical line, the line $x = 3$. So the outputs the graph gives to the input $3$ are the heights where that line meets the graph. If it meets the graph once, $3$ has one output; if it meets the graph twice, $3$ has two outputs, and the graph cannot belong to a function. Here the parabola is met once by every vertical line:

{{figure 0}}

This gives the **vertical line test**: a graph is the graph of a function exactly when **no vertical line meets it more than once**. A line that misses the graph entirely is fine: it only means that input is not in the domain. In this lesson we apply the test to curves, and to graphs made of pieces whose ends line up.`,
    `当每个输入恰好有一个输出时，关系就是函数。对于数对列表，我们通过找重复的第一个坐标来检查。对于图形，有更快的看法。

平面上所有输入为 $3$ 的点都在同一条竖直线上，即直线 $x = 3$。所以图形给输入 $3$ 的输出，就是这条直线与图形交点的高度。如果交于一点，$3$ 就只有一个输出；如果交于两点，$3$ 就有两个输出，这个图形就不可能是函数的图象。下面的抛物线与每条竖直线都只交于一点：

{{figure 0}}

这就是**竖直线检验**：一个图形是函数的图象，当且仅当**任何一条竖直线与它的交点都不超过一个**。与图形完全不相交的竖直线没有问题：这只说明那个输入不在定义域中。这节课先对曲线使用这个检验，再处理由几段组成、端点上下对齐的图形。`,
  ),
  introFigures: [
    curveFigure(
      [{ kind: "curve", f: (x) => (x * x) / 2 - 3, accent: true }, ...[-3, 0, 2].flatMap((a) => verticalAt(a, [[a, (a * a) / 2 - 3]]))],
      "The parabola y = x²/2 − 3 with the dashed vertical lines x = −3, x = 0 and x = 2, each meeting it at one point.",
      "抛物线 y = x²/2 − 3 和虚线竖直线 x = −3、x = 0、x = 2，每条都只与它交于一点。",
    ),
  ],
  knowledgePoints: [
    {
      id: "applying-the-vertical-line-test",
      title: t("Applying the vertical line test", "使用竖直线检验"),
      explanation: t(
        `To apply the test, imagine sliding a vertical line across the graph from left to right and watch how many points it touches at each moment. If at some position it touches the graph at two points $(a, b)$ and $(a, c)$, the input $a$ would have the two outputs $b$ and $c$, so the graph is not a function. One such line is enough to fail the test.

The parabola $y = x^{2}$ passes: above each $x$ there is exactly one point. The circle in the figure below fails: the line $x = 1$ meets it twice, once on the top half and once on the bottom half. Curves that turn back sideways, such as a circle or a parabola opening to the side, always fail.

> **Watch out.** The test uses **vertical** lines, which hold one input fixed. A horizontal line meeting a graph several times only means several inputs share an output, which a function allows: the parabola $y = x^{2}$ meets $y = 4$ twice and is still a function.`,
        `使用这个检验时，设想一条竖直线从左到右扫过图形，观察它每一刻碰到图形的点有几个。如果在某个位置它碰到两点 $(a, b)$ 和 $(a, c)$，输入 $a$ 就会有两个输出 $b$ 和 $c$，图形就不是函数。只要找到一条这样的直线，检验就不通过。

抛物线 $y = x^{2}$ 通过检验：每个 $x$ 的上方恰好有一个点。下图中的圆不通过检验：直线 $x = 1$ 与它交于两点，一点在上半圆，一点在下半圆。会向侧面折回的曲线，比如圆或开口向侧面的抛物线，总是不能通过检验。

> **注意。** 检验用的是**竖直**线，它固定一个输入。水平线与图形交于多点，只说明几个输入有相同的输出，这是函数允许的：抛物线 $y = x^{2}$ 与 $y = 4$ 交于两点，它仍然是函数。`,
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
        const solution = (relation: Relation) =>
          t(
            `**Step 1: slide a vertical line across.** Each position of the line holds one input fixed; count where it touches the graph.

${relation.why.en}

**Step 2: decide.** ${isFunction ? "No vertical line meets the graph more than once, so it is the graph of a function." : "One vertical line meeting the graph twice is enough: it is not the graph of a function."}`,
            `**第一步：让竖直线扫过图形。** 竖直线的每个位置固定一个输入；数一数它碰到图形的点。

${relation.why["zh-CN"]}

**第二步：判断。** ${isFunction ? "没有竖直线与图形交于不止一点，所以它是函数的图象。" : "只要有一条竖直线与图形交于两点就够了：它不是函数的图象。"}`,
          );
        // The verdict is drawn before the graph, as it always was, and the solution written once the graph is known.
        const problem = verdictChoice(rng, {
          prompt: t("Is this the graph of a function?", "这是函数的图象吗？"),
          holds: isFunction,
          yes: t("every vertical line meets the graph at most once", "每条竖直线与图形最多交于一点"),
          no: t("some vertical line meets the graph more than once", "存在与图形交于不止一点的竖直线"),
          yesWrong: t("every horizontal line meets the graph at most once", "每条水平线与图形最多交于一点"),
          noWrong: t("some horizontal line meets the graph more than once", "存在与图形交于不止一点的水平线"),
          solution: t("", ""),
        });
        const relation = relationGraph(rng, kind);
        return annotate(
          { ...problem, solution: solution(relation), figure: relation.figure },
          view,
          verticalAt(relation.at, relation.meets),
          `The vertical line x = ${relation.at} meets the graph at ${relation.meets.length === 1 ? "one point" : `${relation.meets.length} points`}.`,
          `竖直线 x = ${relation.at} 与图形交于 ${relation.meets.length} 点。`,
        );
      },
    },
    {
      id: "endpoints-and-the-vertical-line-test",
      figure: algebraDrawings["vertical-line-test#endpoints-and-the-vertical-line-test"],
      title: t("Endpoints and the vertical line test", "端点与竖直线检验"),
      explanation: t(
        `When a graph is made of pieces, two pieces may end one above the other at the same $x$. Only there can a vertical line meet the graph twice, and the dots decide whether it does. A filled dot is a point of the graph; an open dot is a hole, a point that is **not** on the graph. So the vertical line meets the graph twice there only if **both** dots are filled.

- A filled dot at $(2, 1)$ and an open dot at $(2, 4)$: the line $x = 2$ meets the graph only at $(2, 1)$. It is a function, with $f(2) = 1$.
- Filled dots at both $(2, 1)$ and $(2, 4)$: the line $x = 2$ meets the graph twice, so $2$ would have two outputs. It is not a function.
- Open dots at both: the line $x = 2$ misses the graph. It is a function, and $2$ is simply not in its domain.

> **Watch out.** A jump, a gap or an open dot does not stop a graph from being a function. What breaks the test is two **filled** points on the same vertical line, so look at the dots, not at whether the pieces join.`,
        `当图象由几段组成时，可能有两段在同一个 $x$ 处上下对齐地结束。只有在那里，竖直线才可能与图象交于两点，而由端点来决定是否如此。实心点是图象上的点；空心点是一个"洞"，**不在**图象上。所以只有**两个**点都是实心点时，那里的竖直线才与图象交于两点。

- $(2, 1)$ 处为实心点，$(2, 4)$ 处为空心点：直线 $x = 2$ 只与图象交于 $(2, 1)$。是函数，且 $f(2) = 1$。
- $(2, 1)$ 和 $(2, 4)$ 处都是实心点：直线 $x = 2$ 与图象交于两点，$2$ 就有两个输出。不是函数。
- 两处都是空心点：直线 $x = 2$ 与图象不相交。是函数，只是 $2$ 不在定义域中。

> **注意。** 跳跃、缺口或空心点都不妨碍图象成为函数。破坏检验的是同一条竖直线上的两个**实心**点，所以要看端点，而不是看两段有没有连起来。`,
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
        const dot = (open: boolean, y: number) =>
          open
            ? t(`an open dot at $(${a}, ${y})$`, `$(${a}, ${y})$ 处是空心点`)
            : t(`a filled dot at $(${a}, ${y})$`, `$(${a}, ${y})$ 处是实心点`);
        const [dl, dr] = [dot(openL, yl), dot(openR, yr)];
        const filled = [...(openL ? [] : [yl]), ...(openR ? [] : [yr])];
        const verdict =
          filled.length === 2
            ? t(
                `Both dots are filled, so the line $x = ${a}$ meets the graph twice and the input $${a}$ would have the two outputs $${yl}$ and $${yr}$: it is **not** the graph of a function.`,
                `两个点都是实心点，所以直线 $x = ${a}$ 与图象交于两点，输入 $${a}$ 会有两个输出 $${yl}$ 和 $${yr}$：它**不是**函数的图象。`,
              )
            : filled.length === 1
              ? t(
                  `Only one dot is filled, so the line $x = ${a}$ meets the graph once, at height $${filled[0]}$. Every other vertical line meets it at most once too: it **is** the graph of a function, with output $${filled[0]}$ at $x = ${a}$.`,
                  `只有一个点是实心点，所以直线 $x = ${a}$ 只与图象交于一点，高度为 $${filled[0]}$。其他竖直线也都最多交于一点：它**是**函数的图象，在 $x = ${a}$ 处的输出是 $${filled[0]}$。`,
                )
              : t(
                  `Both dots are open, so the line $x = ${a}$ misses the graph: $${a}$ is just not in the domain. Every other vertical line meets the graph once: it **is** the graph of a function.`,
                  `两个点都是空心点，所以直线 $x = ${a}$ 与图象不相交：$${a}$ 只是不在定义域中。其他竖直线都只与图象交于一点：它**是**函数的图象。`,
                );
        return annotate(
          {
            ...verdictChoice(rng, {
              prompt: t("Is this the graph of a function?", "这是函数的图象吗？"),
              holds: isFunction,
              yes: t(`at most one of the two dots at $x = ${a}$ is filled`, `$x = ${a}$ 处的两个点中至多有一个是实心点`),
              no: t(`both of the dots at $x = ${a}$ are filled`, `$x = ${a}$ 处的两个点都是实心点`),
              yesWrong: t(`the two pieces do not join at $x = ${a}$`, `两段在 $x = ${a}$ 处没有连起来`),
              noWrong: t(`one of the dots at $x = ${a}$ is open, so the graph has a gap`, `$x = ${a}$ 处有一个空心点，所以图形有缺口`),
              solution: t(
                `**Step 1: find the only place to worry about.** Each piece moves steadily to the right, so a vertical line meets each piece at most once. Only at $x = ${a}$, where the two pieces end one above the other, could the line meet the graph twice.

**Step 2: look at the dots there.** The left piece ends with ${dl.en}, and the right piece starts with ${dr.en}.

**Step 3: decide.** ${verdict.en}`,
                `**第一步：找出唯一需要注意的地方。** 每一段都一直向右延伸，所以竖直线与每一段最多交于一点。只有在 $x = ${a}$ 处，两段上下对齐地结束，竖直线才可能与图象交于两点。

**第二步：看那里的点。** 左边一段的终点：${dl["zh-CN"]}；右边一段的起点：${dr["zh-CN"]}。

**第三步：判断。** ${verdict["zh-CN"]}`,
              ),
            }),
            figure: graphFigure(pieces, "a relation"),
          },
          view,
          verticalAt(
            a,
            filled.map((y): Point => [a, y]),
          ),
          `The vertical line x = ${a} meets the graph at ${filled.length} point${filled.length === 1 ? "" : "s"}.`,
          `竖直线 x = ${a} 与图象交于 ${filled.length} 点。`,
        );
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
  intro: t(
    `On the graph of a function, the height of the point above or below each input is its output. So questions about the **largest** and **smallest** outputs become questions about the highest and lowest points of the graph.

Suppose $f$ records the temperature, in degrees, $x$ hours after midnight, and its graph runs through $(-5, 2)$, $(-2, -2)$, $(1, 5)$ and $(4, 1)$. The highest point is $(1, 5)$ and the lowest is $(-2, -2)$:

{{figure 0}}

So the largest output, the **maximum value** of $f$, is $5$, reached at $x = 1$; the smallest output, the **minimum value**, is $-2$, reached at $x = -2$. Together they are called the **global extrema** of $f$. They answer everyday questions such as "how hot did it get, and when?" In this lesson we read maximum and minimum values off graphs, find where they occur, and see why some functions have no maximum or no minimum at all.`,
    `在函数的图象上，每个输入正上方或正下方那个点的高度就是它的输出。所以关于**最大**和**最小**输出的问题，就变成了关于图象最高点和最低点的问题。

假设 $f$ 记录午夜后 $x$ 小时的气温（单位：度），它的图象经过 $(-5, 2)$、$(-2, -2)$、$(1, 5)$ 和 $(4, 1)$。最高点是 $(1, 5)$，最低点是 $(-2, -2)$：

{{figure 0}}

所以最大的输出，即 $f$ 的**最大值**，是 $5$，在 $x = 1$ 处取得；最小的输出，即**最小值**，是 $-2$，在 $x = -2$ 处取得。它们统称为 $f$ 的**最值**。最值回答的是"最热时有多热、在什么时候"这类日常问题。这节课先从图象读出最大值和最小值，再找出取得最值的位置，最后看看为什么有些函数根本没有最大值或最小值。`,
  ),
  introFigures: [
    {
      svg: plane(view, [...pieceMarks([{ pts: temperatureGraph }]), ...guides([1, 5], "(1, 5)"), ...guides([-2, -2], "(−2, −2)")]),
      alt: t(
        "A graph through (−5, 2), (−2, −2), (1, 5), (4, 1). Its highest point (1, 5) and lowest point (−2, −2) are marked, with dashed guides to both axes.",
        "经过 (−5, 2)、(−2, −2)、(1, 5)、(4, 1) 的图象。标出了最高点 (1, 5) 和最低点 (−2, −2)，并有到两条坐标轴的虚线。",
      ),
    },
  ],
  knowledgePoints: [
    {
      id: "maximum-and-minimum-values",
      figure: gradeDrawings5["global-extrema#maximum-and-minimum-values"],
      title: t("Maximum and minimum values", "最大值与最小值"),
      explanation: t(
        `The outputs of a function are the heights of the points of its graph. So its **maximum value**, the largest output, is the $y$-coordinate of the **highest** point of the graph, and its **minimum value** is the $y$-coordinate of the **lowest** point. Together they are the **global extrema**.

For a graph made of straight segments, the highest and lowest points are always at corners or ends, so compare the heights of those. On the graph through $(-4, 1)$, $(-1, 4)$, $(2, -3)$, $(5, 0)$ the heights are $1, 4, -3, 0$: the maximum value is $4$ and the minimum value is $-3$.

> **Watch out.** The maximum value is a **height**, a $y$-value. The $x$-value where it occurs, $-1$ here, is a different number. And the extreme point need not be at an end of the graph: compare every corner, not just the first and last.`,
        `函数的输出就是图象上各点的高度。所以函数的**最大值**，即最大的输出，是图象**最高**点的 $y$ 坐标；**最小值**是**最低**点的 $y$ 坐标。它们统称为**最值**。

对于由线段组成的图象，最高点和最低点总在拐点或端点处，所以比较这些点的高度即可。在经过 $(-4, 1)$、$(-1, 4)$、$(2, -3)$、$(5, 0)$ 的图象上，高度是 $1, 4, -3, 0$：最大值是 $4$，最小值是 $-3$。

> **注意。** 最大值是一个**高度**，即 $y$ 值。取得最大值处的 $x$ 值（这里是 $-1$）是另一个数。另外，最高点不一定在图象的端点：要比较所有拐点，而不只是第一个和最后一个点。`,
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
        return annotate(
          {
            ...numberProblem({
              prompt: t(
                `The graph of $${name}$ is shown. What is the ${word.en} value of $${name}$?`,
                `如图是 $${name}$ 的图象。$${name}$ 的${word["zh-CN"]}是多少？`,
              ),
              answer: best,
              wrong: [at, other, pts[0]![1], pts[pts.length - 1]![1]],
              solution: t(
                `**Step 1: compare the corners.** The graph is made of straight segments, so its ${max ? "highest" : "lowest"} point is a corner or an end. Their heights, from left to right, are $${ys.join(", ")}$.

**Step 2: read the extreme height.** The ${max ? "greatest" : "least"} of them is $${best}$, at the point $(${at}, ${best})$. So the ${word.en} value of $${name}$ is $${best}$.

**Check.** No height in the list is ${max ? "greater" : "less"} than $${best}$, and the answer is the height, not the input $${at}$ where it occurs.`,
                `**第一步：比较各拐点。** 图象由线段组成，所以最${max ? "高" : "低"}点是某个拐点或端点。从左到右，它们的高度是 $${ys.join(", ")}$。

**第二步：读出最值。** 其中最${max ? "大" : "小"}的是 $${best}$，在点 $(${at}, ${best})$ 处。所以 $${name}$ 的${word["zh-CN"]}是 $${best}$。

**检验。** 列出的高度中没有比 $${best}$ 更${max ? "大" : "小"}的；答案是高度，而不是取得它的输入 $${at}$。`,
              ),
            }),
            figure: graphFigure([{ pts }], name),
          },
          view,
          guides([at, best], spot([at, best])),
          `The graph is ${max ? "highest" : "lowest"} at ${spot([at, best])}.`,
          `图象在 ${spot([at, best])} 处${max ? "最高" : "最低"}。`,
        );
      },
    },
    {
      id: "where-extrema-occur",
      title: t("Where the extrema occur", "取得最值的位置"),
      explanation: t(
        `Asking **where** a function takes its maximum asks for the **input** that produces the largest output: the $x$-coordinate of the highest point. The maximum value and its location are the two coordinates of one point.

If the highest point of a graph is $(-2, 5)$, the maximum value is $5$, its height, and it occurs at $x = -2$, its position along the $x$-axis. In function notation, $f(-2) = 5$ and no output is larger.

> **Watch out.** "At what value of $x$" wants the first coordinate, so answer $-2$, not the height $5$. And use the **highest** point for a maximum and the **lowest** for a minimum: reading the other extreme gives the wrong location.`,
        `问函数在**哪里**取得最大值，是问哪个**输入**产生最大的输出，即最高点的 $x$ 坐标。最大值和取得它的位置是同一个点的两个坐标。

若图象的最高点是 $(-2, 5)$，则最大值是它的高度 $5$，在它沿 $x$ 轴的位置 $x = -2$ 处取得。用函数记号写，就是 $f(-2) = 5$，且没有更大的输出。

> **注意。** "$x$ 取何值时"要的是第一个坐标，所以答 $-2$，而不是高度 $5$。另外，求最大值的位置用**最高**点，求最小值的位置用**最低**点：读成另一个最值，位置就错了。`,
      ),
      generate(rng) {
        const name = rng.pick(names);
        const max = rng.bool();
        const { pts, at } = peakWalk(rng, max ? 1 : -1);
        const ys = pts.map((p) => p[1]);
        const opposite = pts.find((p) => p[1] === (max ? Math.min(...ys) : Math.max(...ys)))![0];
        const word = extremumWord(max);
        const top = max ? 5 : -5;
        return annotate(
          {
            ...numberProblem({
              prompt: t(
                `The graph of $${name}$ is shown. At what value of $x$ does $${name}$ reach its ${word.en} value?`,
                `如图是 $${name}$ 的图象。$${name}$ 在 $x$ 取何值时取得${word["zh-CN"]}？`,
              ),
              answer: at,
              solveFor: "x",
              wrong: [top, opposite],
              solution: t(
                `**Step 1: find the ${max ? "highest" : "lowest"} point.** Comparing the corners, the graph is ${max ? "highest" : "lowest"} at $(${at}, ${top})$, at height $${top}$.

**Step 2: read its input.** The question asks for the $x$-value, the first coordinate: the ${word.en} occurs at $x = ${at}$.

**Check.** $${valueLatex(name, at, top)}$, and no other point of the graph is ${max ? "as high" : "as low"}, so $x = ${at}$ is where the ${word.en} value $${top}$ is reached.`,
                `**第一步：找最${max ? "高" : "低"}点。** 比较各拐点，图象在 $(${at}, ${top})$ 处最${max ? "高" : "低"}，高度为 $${top}$。

**第二步：读出它的输入。** 题目问的是 $x$ 值，即第一个坐标：在 $x = ${at}$ 处取得${word["zh-CN"]}。

**检验。** $${valueLatex(name, at, top)}$，且图象上没有别的点${max ? "这么高" : "这么低"}，所以$${name}$ 在 $x = ${at}$ 处取得${word["zh-CN"]} $${top}$。`,
              ),
            }),
            figure: graphFigure([{ pts }], name),
          },
          view,
          guides([at, top], `x = ${at}`),
          `The graph is ${max ? "highest" : "lowest"} at x = ${at}.`,
          `图象在 x = ${at} 处${max ? "最高" : "最低"}。`,
        );
      },
    },
    {
      id: "extrema-that-do-not-exist",
      figure: gradeDrawings5["global-extrema#extrema-that-do-not-exist"],
      title: t("When there is no maximum or minimum", "没有最值的情形"),
      explanation: t(
        `A maximum value must be an actual output: a height the graph **reaches**. A graph can approach a height without reaching it. If the graph rises to an **open** dot at $(4, 5)$, the point $(4, 5)$ is not on the graph. The outputs get as close to $5$ as we like, such as $4.9$, $4.99$, $4.999$, but never equal $5$, and whatever output we pick, a point a little closer to the open dot is higher. So no output is the largest: the function has **no maximum value**.

If some other, filled point of the graph is at height $5$, then $5$ is an output after all, and the maximum value is $5$.

> **Watch out.** Do not give the height of an open dot unless a filled point also reaches it. And do not settle for the highest filled corner below the open dot: points near the open dot are higher still, so that corner is not the maximum either.`,
        `最大值必须是一个真正取到的输出，即图象**达到**的高度。图象可以无限接近某个高度却达不到它。如果图象上升到 $(4, 5)$ 处的**空心**点，点 $(4, 5)$ 就不在图象上。输出可以任意接近 $5$，例如 $4.9$、$4.99$、$4.999$，但永远不等于 $5$；无论取哪个输出，离空心点更近一点的点都更高。所以没有哪个输出是最大的：函数**没有最大值**。

如果图象上另有一个实心点高度为 $5$，那么 $5$ 仍是一个输出，最大值就是 $5$。

> **注意。** 除非有实心点也达到这个高度，否则不要把空心点的高度当作最值。也不要退而取空心点下面最高的实心拐点：靠近空心点的点比它还高，所以它也不是最大值。`,
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
        const j = end === 0 ? pts.length - 1 : 0;
        if (open && reached) {
          // The extreme height is also reached at the other, filled end.
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
        const filledAt = open ? pts[j]! : edge;
        const first = t(
          `**Step 1: find the extreme height.** The graph goes ${max ? "highest" : "lowest"} at the end $(${edge[0]}, ${edge[1]})$, at height $${5 * sign}$, where the dot is ${open ? "open" : "filled"}.`,
          `**第一步：找出极端的高度。** 图象在端点 $(${edge[0]}, ${edge[1]})$ 处最${max ? "高" : "低"}，高度为 $${5 * sign}$，那里是${open ? "空心" : "实心"}点。`,
        );
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
                  `${first.en}

**Step 2: is that height reached?** ${open ? `The open dot is not on the graph, but the filled point $(${filledAt[0]}, ${filledAt[1]})$ is at the same height` : "The filled dot is a point of the graph"}, so $${5 * sign}$ is an output, and nowhere does the graph go ${max ? "higher" : "lower"}. The ${word.en} value is $${5 * sign}$.

**Check.** $${valueLatex(name, filledAt[0], 5 * sign)}$ is an actual output, and every other point of the graph is ${max ? "at or below" : "at or above"} that height.`,
                  `${first["zh-CN"]}

**第二步：这个高度是否达到？** ${open ? `空心点不在图象上，但实心点 $(${filledAt[0]}, ${filledAt[1]})$ 的高度相同` : "实心点是图象上的点"}，所以 $${5 * sign}$ 是一个输出，而且图象没有更${max ? "高" : "低"}的地方。${word["zh-CN"]}是 $${5 * sign}$。

**检验。** $${valueLatex(name, filledAt[0], 5 * sign)}$ 是真正取到的输出，图象上其他点都${max ? "不高于" : "不低于"}这个高度。`,
                )
              : t(
                  `${first.en}

**Step 2: is that height reached?** The open dot is not on the graph, and no other point is at height $${5 * sign}$. The outputs come as close to $${5 * sign}$ as we like without reaching it, so no output is the ${max ? "largest" : "smallest"}: there is no ${word.en} value.

**Check.** The ${max ? "highest" : "lowest"} filled corner, at height $${second}$, is not the ${word.en} either: points of the graph near the open dot are ${max ? "higher" : "lower"} than $${second}$.`,
                  `${first["zh-CN"]}

**第二步：这个高度是否达到？** 空心点不在图象上，也没有别的点高度为 $${5 * sign}$。输出可以任意接近 $${5 * sign}$ 却达不到，所以没有最${max ? "大" : "小"}的输出：没有${word["zh-CN"]}。

**检验。** 最${max ? "高" : "低"}的实心拐点（高度 $${second}$）也不是${word["zh-CN"]}：图象上靠近空心点的点比 $${second}$ 更${max ? "高" : "低"}。`,
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

/** endArrows draws arrows on both ends of a curve y = f(x) inside the standard view, pointing the way it leaves the window. */
function endArrows(f: (x: number) => number): PlaneMark[] {
  const inside = (x: number) => Math.abs(f(x)) <= 5.5;
  let right = 5.8;
  while (right > 0 && !inside(right)) right -= 0.05;
  let left = -5.8;
  while (left < 0 && !inside(left)) left += 0.05;
  return [
    { kind: "arrow", from: [right - 0.4, f(right - 0.4)], to: [right, f(right)], tone: "result" },
    { kind: "arrow", from: [left + 0.4, f(left + 0.4)], to: [left, f(left)], tone: "result" },
  ];
}

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
  intro: t(
    `A graph on a page shows only a window of a function. What happens far beyond it, to the right and to the left? Take $f(x) = x^{3} - 4x$ and try large inputs:

$$f(10) = 960, \\qquad f(100) = 999\\,600, \\qquad f(-10) = -960, \\qquad f(-100) = -999\\,600.$$

As the inputs grow to the right, the outputs grow without bound; as the inputs go far to the left, the outputs fall without bound. The graph leaves the window upward on the right and downward on the left:

{{figure 0}}

This is the **end behavior** of $f$. We write it with arrows: $f(x) \\to \\infty$ as $x \\to \\infty$, read "$f(x)$ goes to infinity as $x$ goes to infinity", and $f(x) \\to -\\infty$ as $x \\to -\\infty$. Notice that the turns of the graph near the middle play no part: far out, the term $x^{3}$ is so much larger than $4x$ that it alone decides. In this lesson we read end behavior from graphs, and then from the leading term of a polynomial without drawing anything.`,
    `纸上的图象只显示函数的一个窗口。在窗口之外很远的地方，向右和向左会怎样？取 $f(x) = x^{3} - 4x$，试几个很大的输入：

$$f(10) = 960, \\qquad f(100) = 999\\,600, \\qquad f(-10) = -960, \\qquad f(-100) = -999\\,600.$$

输入向右越来越大时，输出无限增大；输入向左走得很远时，输出无限减小。图象在右边向上离开窗口，在左边向下离开窗口：

{{figure 0}}

这就是 $f$ 的**端点行为**。我们用箭头记号来写：当 $x \\to \\infty$ 时 $f(x) \\to \\infty$，读作"当 $x$ 趋于无穷大时，$f(x)$ 趋于无穷大"；当 $x \\to -\\infty$ 时 $f(x) \\to -\\infty$。注意，图象中间的弯曲不起作用：在很远处，$x^{3}$ 比 $4x$ 大得多，只由它决定走向。这节课先从图象读出端点行为，再不画图、直接由多项式的首项判断。`,
  ),
  introFigures: [
    curveFigure(
      [{ kind: "curve", f: (x) => (x ** 3 - 4 * x) / 2, accent: true }, ...endArrows((x) => (x ** 3 - 4 * x) / 2)],
      "An S-shaped graph like that of x³ − 4x: it falls off the bottom of the window at the left and rises off the top at the right, with arrows at both ends.",
      "形如 x³ − 4x 的 S 形图象：左端向下离开窗口，右端向上离开窗口，两端画有箭头。",
    ),
  ],
  knowledgePoints: [
    {
      id: "end-behavior-from-a-graph",
      figure: algebraDrawings["end-behavior#end-behavior-from-a-graph"],
      title: t("End behavior from a graph", "从图象看端点行为"),
      explanation: t(
        `The **end behavior** of a function says what its outputs do at the far right and the far left of the graph. The far right is where $x \\to \\infty$; the far left is where $x \\to -\\infty$. At each end, the graph of a polynomial either rises without bound, $f(x) \\to \\infty$, or falls without bound, $f(x) \\to -\\infty$.

So read the two ends separately. For $y = x^{2}$, follow the graph to the right: it rises, so $f(x) \\to \\infty$ as $x \\to \\infty$. Follow it to the left: it rises there too, so $f(x) \\to \\infty$ as $x \\to -\\infty$. The two ends do not have to agree; for $y = x^{3}$ the left end falls.

> **Watch out.** $x \\to -\\infty$ describes the **left** end, even though it is written second. Match each arrow statement to the correct end, and judge only the ends: the bumps and turns in the middle of the graph do not change the end behavior.`,
        `函数的**端点行为**说明图象最右端和最左端的输出如何变化。最右端是 $x \\to \\infty$ 的地方；最左端是 $x \\to -\\infty$ 的地方。在每一端，多项式的图象要么无限上升，$f(x) \\to \\infty$，要么无限下降，$f(x) \\to -\\infty$。

所以两端要分别看。对于 $y = x^{2}$，沿图象向右看：它上升，所以当 $x \\to \\infty$ 时 $f(x) \\to \\infty$。向左看：也上升，所以当 $x \\to -\\infty$ 时 $f(x) \\to \\infty$。两端不必相同；$y = x^{3}$ 的左端就是下降的。

> **注意。** $x \\to -\\infty$ 描述的是**左**端，尽管它写在后面。要把每个箭头式子对应到正确的一端，而且只看两端：图象中间的起伏和弯曲不改变端点行为。`,
      ),
      generate(rng) {
        const degree = rng.int(1, 4);
        const roots = range(1, degree).map(() => rng.int(-3, 3));
        const sign = rng.sign();
        const scale = [1, 1, 2, 4, 12][degree]!;
        const f = (x: number) => (sign * roots.reduce((acc, r) => acc * (x - r), 1)) / scale;
        const shift = rng.int(-2, 2);
        const correct = endIndex(sign, degree);
        const leftSign = degree % 2 === 0 ? sign : -sign;
        const right = sign > 0 ? "up" : "down";
        const left = leftSign > 0 ? "up" : "down";
        const zh = (d: string) => (d === "up" ? "上升" : "下降");
        const g = (x: number) => f(x) + shift;
        return annotate(
          {
            ...choiceProblem({
              prompt: t(
                "The graph of the polynomial function $f$ is shown; it keeps going in the same direction beyond the window. Describe its end behavior.",
                "如图是多项式函数 $f$ 的图象，在窗口之外它保持原来的趋势。描述它的端点行为。",
              ),
              options: endOptions,
              correct,
              solution: t(
                `**Step 1: the right end.** Follow the graph to the far right: it goes ${right}. So as $x \\to \\infty$, $f(x) \\to ${arrowWord(sign)}$.

**Step 2: the left end.** Follow it to the far left: it goes ${left}. The left end is where $x \\to -\\infty$, so there $f(x) \\to ${arrowWord(leftSign)}$.

**Step 3: put them together.** As $x \\to \\infty$, $f(x) \\to ${arrowWord(sign)}$; as $x \\to -\\infty$, $f(x) \\to ${arrowWord(leftSign)}$. ${sign === leftSign ? "Both ends go the same way." : "The two ends go opposite ways."}`,
                `**第一步：右端。** 沿图象看到最右边：它${zh(right)}。所以当 $x \\to \\infty$ 时 $f(x) \\to ${arrowWord(sign)}$。

**第二步：左端。** 沿图象看到最左边：它${zh(left)}。左端对应 $x \\to -\\infty$，所以那里 $f(x) \\to ${arrowWord(leftSign)}$。

**第三步：合起来。** 当 $x \\to \\infty$ 时 $f(x) \\to ${arrowWord(sign)}$；当 $x \\to -\\infty$ 时 $f(x) \\to ${arrowWord(leftSign)}$。${sign === leftSign ? "两端走向相同。" : "两端走向相反。"}`,
              ),
            }),
            figure: curveFigure(
              [{ kind: "curve", f: g, accent: true }],
              `The graph of a polynomial function of degree ${degree}. At the right end it goes ${right}; at the left end it goes ${left}.`,
              `一个 ${degree} 次多项式函数的图象。右端${zh(right)}，左端${zh(left)}。`,
            ),
          },
          view,
          endArrows(g),
          `Arrows at the ends: ${right} at the right, ${left} at the left.`,
          `两端的箭头：右端${zh(right)}，左端${zh(left)}。`,
        );
      },
    },
    {
      id: "end-behavior-of-polynomials",
      title: t("End behavior of polynomials", "多项式的端点行为"),
      explanation: t(
        `For large $|x|$, the term of highest degree, the **leading term** $ax^{n}$, outweighs all the others put together. At $x = 10$, for instance, $x^{5} = 100\\,000$ while $x^{2} = 100$. So the leading term alone decides the end behavior, and it is decided by two signs:

- At the right end $x$ is a large positive number, so $x^{n}$ is positive and $ax^{n}$ has the sign of $a$.
- At the left end $x$ is a large negative number, so $x^{n}$ is positive when $n$ is even and negative when $n$ is odd.

| | $n$ even | $n$ odd |
| :--- | :--- | :--- |
| $a > 0$ | both ends rise | falls on the left, rises on the right |
| $a < 0$ | both ends fall | rises on the left, falls on the right |

For $f(x) = 4x^{2} - 2x^{5} + 1$ the leading term is $-2x^{5}$. At the right $-2x^{5}$ is negative, so $f(x) \\to -\\infty$ as $x \\to \\infty$; at the left $x^{5}$ is negative and $-2x^{5}$ positive, so $f(x) \\to \\infty$ as $x \\to -\\infty$.

> **Watch out.** The leading term is the one of **highest degree**, wherever it is written, not the first term: here $4x^{2}$ comes first but does not lead. And an odd power keeps the sign of a negative $x$, so the two ends of an odd-degree polynomial go opposite ways.`,
        `当 $|x|$ 很大时，次数最高的项，即**首项** $ax^{n}$，比其他所有项加起来还大得多。例如当 $x = 10$ 时，$x^{5} = 100\\,000$，而 $x^{2} = 100$。所以端点行为只由首项决定，并由两个符号决定：

- 在右端，$x$ 是很大的正数，所以 $x^{n}$ 为正，$ax^{n}$ 与 $a$ 同号。
- 在左端，$x$ 是绝对值很大的负数，所以 $n$ 为偶数时 $x^{n}$ 为正，$n$ 为奇数时 $x^{n}$ 为负。

| | $n$ 为偶数 | $n$ 为奇数 |
| :--- | :--- | :--- |
| $a > 0$ | 两端都上升 | 左端下降，右端上升 |
| $a < 0$ | 两端都下降 | 左端上升，右端下降 |

对于 $f(x) = 4x^{2} - 2x^{5} + 1$，首项是 $-2x^{5}$。在右端 $-2x^{5}$ 为负，所以当 $x \\to \\infty$ 时 $f(x) \\to -\\infty$；在左端 $x^{5}$ 为负，$-2x^{5}$ 为正，所以当 $x \\to -\\infty$ 时 $f(x) \\to \\infty$。

> **注意。** 首项是**次数最高**的项，不论它写在哪里，而不是写在最前面的项：这里 $4x^{2}$ 写在最前面，但它不是首项。另外，奇次幂保留负数 $x$ 的符号，所以奇数次多项式的两端走向相反。`,
      ),
      keyPrerequisites: ["degree-of-a-polynomial"],
      generate(rng) {
        const n = rng.int(2, 6);
        const a = rng.nonZero(-7, 7);
        const lower = rng.sample(range(0, n - 1), 2).map((d): [number, number] => [rng.nonZero(-9, 9), d]);
        const terms = rng.shuffle([[a, n] as [number, number], ...lower]);
        const latex = poly(...terms.map(([c, d]): [number, string] => [c, d === 0 ? "" : d === 1 ? "x" : `x^{${d}}`]));
        const lead = poly([a, `x^{${n}}`]);
        const even = n % 2 === 0;
        const leftSign = even ? Math.sign(a) : -Math.sign(a);
        const at = (x: number) => terms.reduce((acc, [c, d]) => acc + c * x ** d, 0);
        const big = (v: number) => num(v).replace(/(\d)(?=(\d{3})+$)/g, "$1\\,");
        return choiceProblem({
          prompt: t(`Describe the end behavior of $f(x) = ${latex}$.`, `描述 $f(x) = ${latex}$ 的端点行为。`),
          options: endOptions,
          correct: endIndex(Math.sign(a), n),
          solution: t(
            `**Step 1: find the leading term.** The term of highest degree is $${lead}$, of degree $${n}$. Far from $0$ it outweighs the other terms, so it decides the end behavior.

**Step 2: the right end.** For a large positive $x$, $x^{${n}}$ is positive, so $${lead}$ has the same sign as its coefficient $${a}$: it is ${a > 0 ? "positive" : "negative"}. As $x \\to \\infty$, $f(x) \\to ${arrowWord(a)}$.

**Step 3: the left end.** For a large negative $x$, $x^{${n}}$ is ${even ? "positive, since the degree is even" : "negative, since the degree is odd"}, so $${lead}$ is ${leftSign > 0 ? "positive" : "negative"}. As $x \\to -\\infty$, $f(x) \\to ${arrowWord(leftSign)}$.

**Check.** $f(10) = ${big(at(10))}$ and $f(-10) = ${big(at(-10))}$, already ${a > 0 ? "large and positive" : "large and negative"} on the right and ${leftSign > 0 ? "large and positive" : "large and negative"} on the left.`,
            `**第一步：找首项。** 次数最高的项是 $${lead}$，次数为 $${n}$。离 $0$ 很远时，它比其他各项大得多，所以由它决定端点行为。

**第二步：右端。** 当 $x$ 是很大的正数时，$x^{${n}}$ 为正，所以 $${lead}$ 与它的系数 $${a}$ 同号，为${a > 0 ? "正" : "负"}。当 $x \\to \\infty$ 时 $f(x) \\to ${arrowWord(a)}$。

**第三步：左端。** 当 $x$ 是绝对值很大的负数时，${even ? `次数为偶数，$x^{${n}}$ 为正` : `次数为奇数，$x^{${n}}$ 为负`}，所以 $${lead}$ 为${leftSign > 0 ? "正" : "负"}。当 $x \\to -\\infty$ 时 $f(x) \\to ${arrowWord(leftSign)}$。

**检验。** $f(10) = ${big(at(10))}$，$f(-10) = ${big(at(-10))}$：右端已经是绝对值很大的${a > 0 ? "正数" : "负数"}，左端是绝对值很大的${leftSign > 0 ? "正数" : "负数"}。`,
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
  encompasses: [],
  xp: 15,
  standards: ["CCSS.HSF.IF.A.1", "CCSS.HSF.IF.B.5"],
  intro: t(
    `The domain of a function is the set of its **inputs**: on a graph, the stretch of the $x$-axis the graph lies over. The other half of the picture is the set of its **outputs**, called the **range**: on a graph, the stretch of the $y$-axis the graph covers, from its lowest point to its highest.

Take again the temperature $f$, $x$ hours after midnight, whose graph runs through $(-5, 2)$, $(-2, -2)$, $(1, 5)$ and $(4, 1)$. Its domain is $[-5, 4]$, the hours it was recorded. Its lowest point is at height $-2$ and its highest at height $5$, and the unbroken graph passes every height between, so the temperatures it took are exactly $[-2, 5]$:

{{figure 0}}

The range tells you which outputs can happen at all: here, the temperature never went above $5$ or below $-2$. In this lesson we find ranges from lists of pairs, from graphs, and from a linear formula with a restricted domain.`,
    `函数的定义域是所有**输入**组成的集合：在图象上，就是图象下方覆盖的那一段 $x$ 轴。另一半是所有**输出**组成的集合，叫做**值域**：在图象上，就是图象从下到上覆盖的那一段 $y$ 轴。

再看午夜后 $x$ 小时的气温 $f$，它的图象经过 $(-5, 2)$、$(-2, -2)$、$(1, 5)$ 和 $(4, 1)$。它的定义域是记录气温的时段 $[-5, 4]$。它的最低点高度是 $-2$，最高点高度是 $5$，而连续不断的图象经过两者之间的每一个高度，所以气温取到的值恰好是 $[-2, 5]$：

{{figure 0}}

值域告诉我们哪些输出可能出现：这里气温从未高于 $5$，也从未低于 $-2$。这节课分别由数对、图象以及限制了定义域的一次函数公式求值域。`,
  ),
  introFigures: [
    {
      svg: plane(view, [...pieceMarks([{ pts: temperatureGraph }]), ...onAxis("y", union(iv(-2, 5)), 6)]),
      alt: t(
        "A graph through (−5, 2), (−2, −2), (1, 5), (4, 1). The part of the y-axis from −2 to 5, the heights it covers, is marked.",
        "经过 (−5, 2)、(−2, −2)、(1, 5)、(4, 1) 的图象。y 轴上从 −2 到 5 的一段，即它覆盖的高度，被标了出来。",
      ),
    },
  ],
  knowledgePoints: [
    {
      id: "range-of-a-set-of-pairs",
      title: t("The range of a set of pairs", "数对集合的值域"),
      explanation: t(
        `The **range** of a function is the set of all its outputs. In an ordered pair $(x, y)$ of a function the output is the **second** coordinate, so for a function given as pairs the range is the set of second coordinates.

For $\\{(-2, 3), (0, 7), (4, 3)\\}$ the second coordinates are $3, 7, 3$. A set lists each member once, and the order does not matter, so the range is $\\{3, 7\\}$. Two inputs sharing the output $3$ is allowed for a function; it just means the range has fewer members than the domain.

> **Watch out.** The first coordinates $-2, 0, 4$ are the inputs: they make up the domain, not the range. And do not add numbers that are not the output of any pair.`,
        `函数的**值域**是所有输出组成的集合。在函数的有序数对 $(x, y)$ 中，输出是**第二个**坐标，所以对于用数对给出的函数，值域就是所有第二个坐标组成的集合。

对于 $\\{(-2, 3), (0, 7), (4, 3)\\}$，第二个坐标是 $3, 7, 3$。集合中每个元素只写一次，顺序无关，所以值域是 $\\{3, 7\\}$。两个输入有相同的输出 $3$，这对函数是允许的，只是值域的元素比定义域少。

> **注意。** 第一个坐标 $-2, 0, 4$ 是输入：它们组成定义域，而不是值域。另外，不要加入不是任何一对的输出的数。`,
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
        const outs = ps.map((p) => p[1]);
        const repeats = new Set(outs).size < outs.length;
        return reasoned(
          choiceProblem({
            prompt: t(`What is the range of the function $${pairs(ps)}$?`, `函数 $${pairs(ps)}$ 的值域是什么？`),
            options: options.map((s) => same(`$${s}$`)),
            correct: options.indexOf(answer),
            solution: t(
              `**Step 1: read the outputs.** The output of each pair is its second coordinate. In order, they are $${outs.join(", ")}$.

**Step 2: write them as a set.** ${repeats ? "Each number is listed once, so the repeated outputs appear once" : "No output repeats"}. In increasing order, the range is $${answer}$.

**Check.** Every number in $${answer}$ is the second coordinate of some pair, and the first coordinates, the inputs, are not mixed in.`,
              `**第一步：读出输出。** 每一对的输出是它的第二个坐标。依次是 $${outs.join(", ")}$。

**第二步：写成集合。** ${repeats ? "每个数只写一次，所以重复的输出只出现一次" : "没有重复的输出"}。按从小到大的顺序，值域是 $${answer}$。

**检验。** $${answer}$ 中的每个数都是某一对的第二个坐标，并且没有混入第一个坐标（输入）。`,
            ),
          }),
          [
            [
              `$${setOf(xs)}$`,
              "Those are the first coordinates, the inputs: that set is the domain.",
              "这些是第一个坐标，即输入：它们组成的是定义域。",
            ],
            [
              `$${setOf([...xs, ...ys])}$`,
              "This mixes in inputs: only second coordinates belong in the range.",
              "这里混入了输入：值域只包含第二个坐标。",
            ],
            [
              `$${setOf([...ys, extra])}$`,
              `This adds $${extra}$, which is not the output of any pair.`,
              `这里多了 $${extra}$，它不是任何一对的输出。`,
            ],
          ],
        );
      },
    },
    {
      id: "range-from-a-graph",
      figure: algebraDrawings["range-of-a-function#range-from-a-graph"],
      title: t("The range from a graph", "由图象求值域"),
      explanation: t(
        `The outputs of a function are the heights of the points of its graph, so on a graph the range is the set of $y$-values the graph covers. Find how far the graph reaches **down** and how far **up**; an unbroken graph passes every height in between.

On the graph through $(-4, 1)$, $(-1, 4)$, $(2, -3)$, $(5, 0)$, the heights of the corners and ends are $1, 4, -3, 0$. The lowest is $-3$ and the highest is $4$, so the range is $[-3, 4]$. Notice that both come from corners in the middle, not from the ends.

An end of the range is left out only if the graph reaches that height **only** at an open dot:

{{figure 0}}

> **Watch out.** The range is read on the $y$-axis; reading the $x$-values gives the domain. And do not take the heights at the two ends of the graph as the range: the lowest and highest points are often corners in the middle.`,
        `函数的输出就是图象上各点的高度，所以在图象上，值域就是图象覆盖的所有 $y$ 值。看图象向**下**延伸到哪里、向**上**延伸到哪里；连续不断的图象会经过两者之间的每一个高度。

在经过 $(-4, 1)$、$(-1, 4)$、$(2, -3)$、$(5, 0)$ 的图象上，各拐点和端点的高度是 $1, 4, -3, 0$。最低是 $-3$，最高是 $4$，所以值域是 $[-3, 4]$。注意，这两个值都来自中间的拐点，而不是两端。

只有当图象**仅**在空心点处达到某个高度时，值域才不包含这个端点：

{{figure 0}}

> **注意。** 值域要在 $y$ 轴上读；读 $x$ 值得到的是定义域。另外，不要把图象两端的高度当作值域的端点：最低点和最高点常常是中间的拐点。`,
      ),
      figures: [
        {
          svg: plane(view, [
            ...pieceMarks([
              {
                pts: [
                  [-4, -2],
                  [0, 3],
                  [4, 5],
                ],
                openStart: true,
              },
            ]),
            ...onAxis("y", union(iv(-2, 5, false, true)), 6),
          ]),
          alt: t(
            "Line segments from an open dot at (−4, −2) through (0, 3) to a filled dot at (4, 5). The y-axis is marked from an open dot at −2 to a filled dot at 5: the range is (−2, 5].",
            "从 (−4, −2) 处的空心点经过 (0, 3) 到 (4, 5) 处实心点的折线。y 轴上从 −2 处的空心点到 5 处的实心点被标出：值域是 (−2, 5]。",
          ),
        },
      ],
      generate(rng) {
        const name = rng.pick(names);
        const pts = walk(rng, rng.int(-5, -2), rng.int(2, 5), -5, 5, 3);
        const piece: Piece = { pts, openStart: rng.bool(), openEnd: rng.bool() };
        const set = rangeOf([piece]);
        const ends = [pts[0]![1], pts[pts.length - 1]![1]].sort((a, b) => a - b);
        const ys = pts.map((p) => p[1]);
        const [lo, hi] = [Math.min(...ys), Math.max(...ys)];
        const last = pts.length - 1;
        const filledAt = (y: number) => pts.find((p, i) => p[1] === y && !(i === 0 && piece.openStart) && !(i === last && piece.openEnd));
        const endText = (y: number, word: Text): Text => {
          const p = filledAt(y);
          const open = pts.find((q) => q[1] === y)!;
          return p
            ? t(
                `The ${word.en} height $${y}$ is reached at the filled point $${pointText(p)}$, so it is included.`,
                `${word["zh-CN"]}高度 $${y}$ 在实心点 $${pointText(p)}$ 处取到，所以包含它。`,
              )
            : t(
                `The ${word.en} height $${y}$ is reached only at the open dot $${pointText(open)}$, so it is left out.`,
                `${word["zh-CN"]}高度 $${y}$ 只在空心点 $${pointText(open)}$ 处达到，所以不包含它。`,
              );
        };
        const low = endText(lo, t("lowest", "最低"));
        const high = endText(hi, t("highest", "最高"));
        return annotate(
          {
            ...intervalProblem({
              prompt: t(`The graph of $${name}$ is shown. Find the range of $${name}$.`, `如图是 $${name}$ 的图象。求 $${name}$ 的值域。`),
              set,
              wrong: [domainOf([piece]), withEnds(set, true), withEnds(set, false), union(iv(ends[0], ends[1]))],
              solution: t(
                `**Step 1: find the lowest and highest points.** The graph is made of straight segments, so its lowest and highest points are corners or ends. Their heights, from left to right, are $${ys.join(", ")}$: the lowest is $${lo}$ and the highest is $${hi}$.

**Step 2: decide the ends.** ${low.en} ${high.en}

**Step 3: write the range.** The graph is unbroken, so it covers every height in between: the range is ${setText(set)}.

**Check.** The answer is read on the $y$-axis; the $x$-values from $${pts[0]![0]}$ to $${pts[last]![0]}$ would give the domain instead.`,
                `**第一步：找出最低点和最高点。** 图象由线段组成，所以最低点和最高点是拐点或端点。从左到右，它们的高度是 $${ys.join(", ")}$：最低是 $${lo}$，最高是 $${hi}$。

**第二步：确定端点。** ${low["zh-CN"]}${high["zh-CN"]}

**第三步：写出值域。** 图象连续不断，所以覆盖两者之间的每一个高度：值域是 ${setText(set)}。

**检验。** 答案是在 $y$ 轴上读出的；从 $${pts[0]![0]}$ 到 $${pts[last]![0]}$ 的 $x$ 值给出的是定义域。`,
              ),
            }),
            figure: graphFigure([piece], name),
          },
          view,
          onAxis("y", set, 6),
          `The graph covers y in ${setAlt(set)}.`,
          `图象覆盖的 y 是 ${setAlt(set)}。`,
        );
      },
    },
    {
      id: "range-of-a-linear-function-on-an-interval",
      title: t("Linear functions on an interval", "区间上的一次函数"),
      explanation: t(
        `A linear function $f(x) = mx + b$ with $m \\ne 0$ moves steadily in one direction: up if $m > 0$, down if $m < 0$. So on an interval its outputs run from the value at one end to the value at the other, and the range is found by evaluating at the two ends.

For $f(x) = -2x + 1$ with domain $-1 \\le x < 3$:

$$f(-1) = -2(-1) + 1 = 3, \\qquad f(3) = -2(3) + 1 = -5.$$

The input $3$ is not in the domain, so the output $-5$ is never reached; the input $-1$ is, so $3$ is reached. Since $m < 0$, the larger output comes from the left end: the range is $(-5, 3]$.

> **Watch out.** When $m < 0$ the order of the ends flips, and the open or closed mark goes with the **input** that produces each end, not with its position on the left or right.`,
        `一次函数 $f(x) = mx + b$（$m \\ne 0$）总是朝一个方向变化：$m > 0$ 时上升，$m < 0$ 时下降。所以在一个区间上，它的输出从一端的值变到另一端的值，求值域只需计算两端的函数值。

对于定义域为 $-1 \\le x < 3$ 的 $f(x) = -2x + 1$：

$$f(-1) = -2(-1) + 1 = 3, \\qquad f(3) = -2(3) + 1 = -5.$$

输入 $3$ 不在定义域内，所以输出 $-5$ 取不到；输入 $-1$ 在定义域内，所以 $3$ 能取到。因为 $m < 0$，较大的输出来自左端：值域是 $(-5, 3]$。

> **注意。** 当 $m < 0$ 时两端的顺序会对调，而空心或实心跟着产生这个端点的**输入**走，而不是跟着它在左边还是右边。`,
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
        const p: Poly = [b, m];
        const kept = (x: number, y: number, inside: boolean) =>
          inside
            ? t(`$${x}$ is in the domain, so $${y}$ is reached`, `$${x}$ 在定义域内，所以能取到 $${y}$`)
            : t(`$${x}$ is not in the domain, so $${y}$ is never reached`, `$${x}$ 不在定义域内，所以取不到 $${y}$`);
        const [kl, kh] = [kept(lo, fl, loIn), kept(hi, fh, hiIn)];
        const atEnds = `$$${name}(${lo}) = ${substitution(p, lo)} = ${fl}, \\qquad ${name}(${hi}) = ${substitution(p, hi)} = ${fh}.$$`;
        return intervalProblem({
          prompt: t(
            `Find the range of $${name}(x) = ${linear(m, b)}$ with domain $${domainText}$.`,
            `求定义域为 $${domainText}$ 的函数 $${name}(x) = ${linear(m, b)}$ 的值域。`,
          ),
          set,
          wrong: [domain, unswapped, withEnds(set, true), withEnds(set, false)],
          solution: t(
            `**Step 1: use the ends.** The slope is $${m}$, so $${name}$ ${m > 0 ? "rises" : "falls"} steadily, and its outputs run between its values at the ends of the domain, $x = ${lo}$ and $x = ${hi}$.

**Step 2: evaluate at the ends.**

${atEnds}

**Step 3: decide the ends.** The input ${kl.en}; the input ${kh.en}.

**Step 4: write the range.** ${m > 0 ? `Since $${name}$ rises, the smaller output $${fl}$ comes from the left end` : `Since $${name}$ falls, the smaller output $${fh}$ comes from the right end`}, so the range is ${setText(set)}.

**Check.** Each end of the range is included exactly when the input that produces it is in the domain: $${fl}$ comes from $x = ${lo}$ and $${fh}$ from $x = ${hi}$.`,
            `**第一步：利用两端。** 斜率是 $${m}$，所以 $${name}$ 一直${m > 0 ? "上升" : "下降"}，它的输出介于定义域两端 $x = ${lo}$ 和 $x = ${hi}$ 处的函数值之间。

**第二步：计算两端的值。**

${atEnds}

**第三步：确定端点。** 输入 ${kl["zh-CN"]}；输入 ${kh["zh-CN"]}。

**第四步：写出值域。** ${m > 0 ? `因为 $${name}$ 上升，较小的输出 $${fl}$ 来自左端` : `因为 $${name}$ 下降，较小的输出 $${fh}$ 来自右端`}，所以值域是 ${setText(set)}。

**检验。** 值域的端点包含与否，恰好取决于产生它的输入是否在定义域内：$${fl}$ 来自 $x = ${lo}$，$${fh}$ 来自 $x = ${hi}$。`,
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
  return `${coef}${inner}^{2}${tail(k)}`;
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
  intro: t(
    `So far the range has been read from one unbroken graph: from its lowest point to its highest. Two kinds of function need more care.

A graph can come in **pieces**. Here one piece climbs from height $-3$ to $0$ and another from $2$ to $4$:

{{figure 0}}

No point of the graph has a height between $0$ and $2$, so the range is not $[-3, 4]$ but two intervals joined, $[-3, 0] \\cup [2, 4]$.

A formula can also hide its lowest or highest value. In $f(x) = (x - 4)^{2} + 1$ the square is never negative and is $0$ at $x = 4$, so $f$ is never below $1$ and reaches $1$: its range is $[1, \\infty)$, found without drawing anything. In this lesson we find ranges of graphs in pieces and of functions built from squares and square roots.`,
    `到目前为止，值域都是从一条连续不断的图象读出的：从最低点到最高点。有两类函数需要更仔细。

图象可以由**几段**组成。下图中一段从高度 $-3$ 升到 $0$，另一段从 $2$ 升到 $4$：

{{figure 0}}

图象上没有任何点的高度在 $0$ 和 $2$ 之间，所以值域不是 $[-3, 4]$，而是两个区间的并 $[-3, 0] \\cup [2, 4]$。

公式也可能把最小值或最大值藏起来。在 $f(x) = (x - 4)^{2} + 1$ 中，平方永远不是负数，并且在 $x = 4$ 时为 $0$，所以 $f$ 不会小于 $1$，又能取到 $1$：它的值域是 $[1, \\infty)$，不用画图就能求出。这节课求分段图象的值域，以及由平方和平方根构成的函数的值域。`,
  ),
  introFigures: [
    {
      svg: plane(view, [
        ...pieceMarks([
          {
            pts: [
              [-5, -3],
              [-2, 0],
            ],
          },
          {
            pts: [
              [1, 2],
              [3, 4],
            ],
          },
        ]),
        ...onAxis("y", union(iv(-3, 0), iv(2, 4)), 6),
      ]),
      alt: t(
        "Two segments: from (−5, −3) to (−2, 0), and from (1, 2) to (3, 4), with filled dots at the ends. The y-axis is marked from −3 to 0 and from 2 to 4, with a gap between 0 and 2.",
        "两条线段：从 (−5, −3) 到 (−2, 0)，以及从 (1, 2) 到 (3, 4)，端点都是实心点。y 轴上从 −3 到 0 和从 2 到 4 被标出，0 与 2 之间有空隙。",
      ),
    },
  ],
  knowledgePoints: [
    {
      id: "ranges-of-graphs-in-pieces",
      figure: algebraDrawings["range-advanced-cases#ranges-of-graphs-in-pieces"],
      title: t("Graphs in several pieces", "分段的图象"),
      explanation: t(
        `Every output of the function is the height of a point on one of the pieces, so the range is everything the pieces cover **together**: find the heights each piece covers, then join them with $\\cup$.

If one piece covers $[-4, -1]$ and another $[2, 5]$, no point has a height between $-1$ and $2$, and the range is $[-4, -1] \\cup [2, 5]$, with a gap. If instead the second piece covered $[-2, 3]$, the two parts would overlap and merge into the single interval $[-4, 3]$.

An open dot leaves its height out of one piece, but the height is still in the range if the **other** piece reaches it.

> **Watch out.** Do not simply go from the lowest point to the highest: heights in a gap that no piece reaches are not in the range. And check an open dot against the other piece before leaving its height out.`,
        `函数的每个输出都是某一段图象上某个点的高度，所以值域是各段**合起来**覆盖的所有高度：先求出每一段覆盖的高度，再用 $\\cup$ 合并。

若一段覆盖 $[-4, -1]$，另一段覆盖 $[2, 5]$，则没有点的高度在 $-1$ 和 $2$ 之间，值域是有间断的 $[-4, -1] \\cup [2, 5]$。若第二段覆盖的是 $[-2, 3]$，两部分就有重叠，合成一个区间 $[-4, 3]$。

空心点使它的高度不属于这一段，但如果**另一段**达到这个高度，它仍在值域内。

> **注意。** 不要直接从最低点取到最高点：没有任何一段达到的那段高度不在值域内。另外，在去掉空心点的高度之前，要先看看另一段是否达到它。`,
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
        const [left, right] = [rangeOf([pieces[0]!]), rangeOf([pieces[1]!])];
        const heights = (p: Piece) => p.pts.map((q) => q[1]).join(", ");
        const all = pieces.flatMap((p) => p.pts.map((q) => q[1]));
        const [lo, hi] = [Math.min(...all), Math.max(...all)];
        const gap = set.length > 1;
        return annotate(
          {
            ...intervalProblem({
              prompt: t(`The graph of $${name}$ is shown. Find the range of $${name}$.`, `如图是 $${name}$ 的图象。求 $${name}$ 的值域。`),
              set,
              wrong: [hull(set), withEnds(set, true), withEnds(set, false), domainOf(pieces), rangeOf([pieces[0]!])],
              solution: t(
                `**Step 1: the left piece.** Its corners and ends have heights $${heights(pieces[0]!)}$, so it covers the heights ${setText(left)}; a height reached only at an open dot is left out.

**Step 2: the right piece.** Its heights are $${heights(pieces[1]!)}$, so it covers ${setText(right)}.

**Step 3: join them.** ${gap ? "No piece reaches the heights between the two parts, so the range has a gap" : "The two parts overlap or meet, so they merge into one interval"}: the range is ${setText(set)}.

**Check.** The lowest point of the whole graph is at height $${lo}$ and the highest at $${hi}$, the outer ends of the range${gap ? ", and the gap matches the band of heights where the graph has no point" : ""}.`,
                `**第一步：左边一段。** 它的拐点和端点的高度是 $${heights(pieces[0]!)}$，所以它覆盖的高度是 ${setText(left)}；只在空心点处达到的高度不包含在内。

**第二步：右边一段。** 它的高度是 $${heights(pieces[1]!)}$，所以它覆盖 ${setText(right)}。

**第三步：合并。** ${gap ? "两部分之间的高度没有任何一段达到，所以值域有间断" : "两部分有重叠或相接，所以合成一个区间"}：值域是 ${setText(set)}。

**检验。** 整个图象的最低点高度是 $${lo}$，最高点高度是 $${hi}$，正是值域最外侧的两端${gap ? "；间断处也正是图象上没有点的那段高度" : ""}。`,
              ),
            }),
            figure: graphFigure(pieces, name),
          },
          view,
          onAxis("y", set, 6),
          `The graph covers y in ${setAlt(set)}.`,
          `图象覆盖的 y 是 ${setAlt(set)}。`,
        );
      },
    },
    {
      id: "ranges-of-squares-and-roots",
      figure: algebraDrawings["range-advanced-cases#ranges-of-squares-and-roots"],
      title: t("Squares and square roots", "平方与平方根"),
      explanation: t(
        `A square is never negative, and it takes every value $\\ge 0$: $(x - 3)^{2}$ is $0$ at $x = 3$ and grows without end as $x$ moves away. So its range is $[0, \\infty)$, wherever the $3$ is. Build the range of a whole formula from there, one operation at a time.

For $g(x) = -2(x + 1)^{2} + 5$: the square takes every value $\\ge 0$; multiplying by $-2$ turns these into every value $\\le 0$; adding $5$ gives every value $\\le 5$. The range is $(-\\infty, 5]$, and $5$ is reached at $x = -1$.

A square root works the same way: $\\sqrt{x - 4}$ takes every value $\\ge 0$, so $\\sqrt{x - 4} - 1$ has range $[-1, \\infty)$.

> **Watch out.** The number inside the square or root, such as the $1$ in $(x + 1)^{2}$, only shifts the graph sideways and does not change the range; the bound comes from the number **added** at the end. And a negative number in front flips the range to everything **at most** that bound.`,
        `平方永远不是负数，并且能取到所有 $\\ge 0$ 的值：$(x - 3)^{2}$ 在 $x = 3$ 时为 $0$，$x$ 离 $3$ 越远它就越大，没有尽头。所以无论 $3$ 是多少，它的值域都是 $[0, \\infty)$。从这里出发，一步一步求出整个公式的值域。

对于 $g(x) = -2(x + 1)^{2} + 5$：平方取到所有 $\\ge 0$ 的值；乘以 $-2$ 后变成所有 $\\le 0$ 的值；再加 $5$，得到所有 $\\le 5$ 的值。值域是 $(-\\infty, 5]$，并且在 $x = -1$ 时取到 $5$。

平方根也是如此：$\\sqrt{x - 4}$ 取到所有 $\\ge 0$ 的值，所以 $\\sqrt{x - 4} - 1$ 的值域是 $[-1, \\infty)$。

> **注意。** 平方或根号里面的数，例如 $(x + 1)^{2}$ 中的 $1$，只让图象左右平移，不改变值域；界限来自最后**加上**的那个数。另外，前面的数是负数时，值域变成**不超过**这个界限的所有值。`,
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
        const inner = linear(1, -h);
        const expr = root ? `${a < 0 ? "-" : ""}${Math.abs(a) === 1 ? "" : Math.abs(a)}\\sqrt{${inner}}${tail(k)}` : squareLatex(a, h, k);
        const set = s > 0 ? union(iv(k, undefined)) : union(iv(undefined, k));
        const base = root ? `\\sqrt{${inner}}` : h === 0 ? "x^{2}" : `(${inner})^{2}`;
        const scaled = `${a === 1 ? "" : a === -1 ? "-" : a}${base}`;
        const bound = s > 0 ? "\\ge" : "\\le";
        const shape = root ? t("square root", "平方根") : t("square", "平方");
        const times =
          a === 1
            ? t(
                `There is no number in front, so $${scaled}$ still takes every value $\\ge 0$.`,
                `前面没有数，所以 $${scaled}$ 仍取到所有 $\\ge 0$ 的值。`,
              )
            : a > 0
              ? t(
                  `Multiplying by the positive number $${a}$ keeps every value $\\ge 0$, and still reaches all of them: $${scaled}$ takes every value $\\ge 0$.`,
                  `乘以正数 $${a}$ 后仍然是所有 $\\ge 0$ 的值：$${scaled}$ 取到所有 $\\ge 0$ 的值。`,
                )
              : a === -1
                ? t(
                    `The minus sign in front flips the signs: $${scaled}$ takes every value $\\le 0$.`,
                    `前面的负号使符号相反：$${scaled}$ 取到所有 $\\le 0$ 的值。`,
                  )
                : t(
                    `Multiplying by the negative number $${a}$ flips the signs: $${scaled}$ takes every value $\\le 0$.`,
                    `乘以负数 $${a}$ 后符号相反：$${scaled}$ 取到所有 $\\le 0$ 的值。`,
                  );
        const add =
          k === 0
            ? t("Nothing is added at the end, so the bound stays $0$", "最后没有加上常数，所以界限仍是 $0$")
            : k > 0
              ? t(`Adding $${k}$ moves the bound from $0$ to $${k}$`, `加上 $${k}$，界限从 $0$ 移到 $${k}$`)
              : t(`Subtracting $${-k}$ moves the bound from $0$ to $${k}$`, `减去 $${-k}$，界限从 $0$ 移到 $${k}$`);
        const next = a + k;
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
            `**Step 1: the ${shape.en}.** $${base}$ is never negative, and it is $0$ at $x = ${h}$, so it takes every value $\\ge 0$.

**Step 2: the number in front.** ${times.en}

**Step 3: the number added.** ${add.en}: $${name}(x)$ takes every value $${bound} ${k}$. The range is ${setText(set)}.

**Check.** At $x = ${h}$ the ${shape.en} is $0$, so $${name}(${h}) = ${k}$ and the bound is reached. At $x = ${h + 1}$ it is $1$, so $${name}(${h + 1}) = ${next}$, which is ${s > 0 ? "above" : "below"} $${k}$ as the range says.`,
            `**第一步：看${shape["zh-CN"]}。** $${base}$ 永远不是负数，并且在 $x = ${h}$ 时为 $0$，所以它取到所有 $\\ge 0$ 的值。

**第二步：前面的数。** ${times["zh-CN"]}

**第三步：加上的数。** ${add["zh-CN"]}：$${name}(x)$ 取到所有 $${bound} ${k}$ 的值。值域是 ${setText(set)}。

**检验。** 当 $x = ${h}$ 时${shape["zh-CN"]}为 $0$，所以 $${name}(${h}) = ${k}$，界限能取到。当 $x = ${h + 1}$ 时它为 $1$，所以 $${name}(${h + 1}) = ${next}$，正如值域所说，${s > 0 ? "大于" : "小于"} $${k}$。`,
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
  encompasses: [{ topic: "two-step-equations", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.HSF.IF.B.4", "CCSS.HSF.IF.C.7.A"],
  intro: t(
    `You can read a function's output for any input, and solve an equation such as $2x - 6 = 0$. Putting the two together answers a question that comes up all the time: **which inputs make the output zero?**

Suppose a stall's profit, in dollars, after selling $x$ cups is $f(x) = 2x - 6$. The profit is $0$, breaking even, when $2x - 6 = 0$, that is at $x = 3$. On the graph, an output of $0$ means a height of $0$, so this is where the graph meets the $x$-axis:

{{figure 0}}

An input with $f(x) = 0$ is called a **root** or **zero** of $f$. Roots mark where a quantity changes sign, from loss to profit here, and later they are the key to solving harder equations. In this lesson we find roots from graphs and from formulas, and tell them apart from the $y$-intercept $(0, -6)$.`,
    `我们会求函数在任何输入处的输出，也会解 $2x - 6 = 0$ 这样的方程。把两者结合起来，就能回答一个经常出现的问题：**哪些输入使输出为零？**

假设一个小摊卖出 $x$ 杯后的利润（单位：元）是 $f(x) = 2x - 6$。当 $2x - 6 = 0$，即 $x = 3$ 时，利润为 $0$，恰好不亏不赚。在图象上，输出为 $0$ 就是高度为 $0$，所以这正是图象与 $x$ 轴相交的地方：

{{figure 0}}

满足 $f(x) = 0$ 的输入叫做 $f$ 的**零点**（也叫**根**）。零点标出一个量改变正负的位置，这里是从亏损变为盈利；以后它们也是解更难的方程的关键。这节课分别从图象和公式求零点，并把零点与 $y$ 轴截距 $(0, -6)$ 区分开。`,
  ),
  introFigures: [
    {
      svg: plane(view, [
        { kind: "line", a: [0, -6], b: [3, 0], accent: true },
        { kind: "point", at: [3, 0], tone: "result", label: "(3, 0)" },
        { kind: "point", at: [0, -6], label: "(0, −6)" },
      ]),
      alt: t(
        "The line y = 2x − 6. It meets the x-axis at (3, 0), marked as the root, and the y-axis at (0, −6).",
        "直线 y = 2x − 6。它与 x 轴交于 (3, 0)，标为零点；与 y 轴交于 (0, −6)。",
      ),
    },
  ],
  knowledgePoints: [
    {
      id: "roots-from-a-graph",
      figure: algebraDrawings["roots-of-a-function#roots-from-a-graph"],
      title: t("Roots from a graph", "从图象求零点"),
      explanation: t(
        `A **root** (or **zero**) of a function $f$ is an input $x$ with $f(x) = 0$. Every point of the graph is $(x, f(x))$, so $f(x) = 0$ means the point has height $0$: it lies **on the $x$-axis**. The roots are the $x$-coordinates of the points where the graph meets the $x$-axis, its **$x$-intercepts**.

If a graph meets the $x$-axis at $(-3, 0)$ and $(2, 0)$ and nowhere else, then $f(-3) = 0$ and $f(2) = 0$, and the roots are $x = -3$ and $x = 2$. A graph can meet the axis many times, once, or never, so a function can have many roots, one, or none.

> **Watch out.** The point where the graph meets the **$y$-axis** is $(0, f(0))$, the $y$-intercept: its height is usually not $0$, so it is not a root. And list **every** crossing, not just the first one you see.`,
        `函数 $f$ 的**零点**（也叫**根**）是满足 $f(x) = 0$ 的输入 $x$。图象上的每个点都是 $(x, f(x))$，所以 $f(x) = 0$ 意味着这个点的高度为 $0$：它在 **$x$ 轴上**。零点就是图象与 $x$ 轴交点的 $x$ 坐标，即 **$x$ 轴截距**。

如果图象与 $x$ 轴只交于 $(-3, 0)$ 和 $(2, 0)$，那么 $f(-3) = 0$，$f(2) = 0$，零点是 $x = -3$ 和 $x = 2$。图象可能与 $x$ 轴相交多次、一次或者不相交，所以函数可能有多个零点、一个零点或没有零点。

> **注意。** 图象与 **$y$ 轴**的交点是 $(0, f(0))$，即 $y$ 轴截距：它的高度一般不是 $0$，所以不是零点。另外，要列出**每一个**交点，而不只是最先看到的那个。`,
      ),
      generate(rng) {
        const name = rng.pick(names);
        const { pts, hits } = levelWalk(rng, 0, -5, 5);
        const wrong: string[][] = [];
        const f0 = valueAt(pts, 0);
        if (f0 !== undefined && f0 !== 0) wrong.push([String(f0)]);
        if (hits.length > 1) wrong.push(hits.slice(1).map(String), hits.slice(0, -1).map(String));
        else wrong.push([String(-hits[0]!)]);
        const many = hits.length > 1;
        const meets = (sep: string) => hits.map((x) => `$(${x}, 0)$`).join(sep);
        const values = (sep: string) => hits.map((x) => `$${name}(${x}) = 0$`).join(sep);
        const yNote =
          f0 !== undefined && f0 !== 0
            ? t(
                ` The $y$-intercept $(0, ${f0})$ lies off the $x$-axis, at height $${f0}$, so the input $x = 0$ is not a root.`,
                `$y$ 轴截距 $(0, ${f0})$ 不在 $x$ 轴上，它的高度是 $${f0}$，所以输入 $x = 0$ 不是零点。`,
              )
            : t("", "");
        return annotate(
          {
            ...solutionsProblem({
              prompt: t(
                `The graph of $${name}$ is shown. Find all roots of $${name}$.`,
                `如图是 $${name}$ 的图象。求 $${name}$ 的所有零点。`,
              ),
              values: hits.map(String),
              wrong,
              solution: t(
                `**Step 1: find where the graph meets the $x$-axis.** A root gives an output of $0$, a point at height $0$. Scanning from left to right, the graph touches the $x$-axis at ${meets(" and ")}${many ? `, ${hits.length} points in all` : ", and nowhere else"}.

**Step 2: read the inputs.** The roots are the $x$-coordinates of these points: ${hits.map((x) => `$x = ${x}$`).join(" and ")}.

**Check.** Each point is $(x, ${name}(x))$ with height $0$, so ${values(" and ")}.${yNote.en}`,
                `**第一步：找出图象与 $x$ 轴的交点。** 零点使输出为 $0$，即点的高度为 $0$。从左到右看，图象与 $x$ 轴交于 ${meets("、")}${many ? `，共 ${hits.length} 个点` : "，别处没有交点"}。

**第二步：读出输入。** 零点是这些点的 $x$ 坐标：${hits.map((x) => `$x = ${x}$`).join("、")}。

**检验。** 每个交点都是高度为 $0$ 的 $(x, ${name}(x))$，所以 ${values("，")}。${yNote["zh-CN"]}`,
              ),
            }),
            figure: graphFigure([{ pts }], name),
          },
          view,
          level(0, hits).slice(1),
          `The graph crosses the x-axis at x = ${hits.join(", ")}.`,
          `图象与 x 轴交于 x = ${hits.join("、")}。`,
        );
      },
    },
    {
      id: "roots-of-linear-functions",
      figure: algebraDrawings["roots-of-a-function#roots-of-linear-functions"],
      title: t("Roots of linear functions", "一次函数的零点"),
      explanation: t(
        `A root is an input where the output is zero, so to find a root from a formula, **set the function equal to $0$ and solve** for $x$. For a linear function $f(x) = ax + b$ with $a \\ne 0$ there is exactly one root, where its line crosses the $x$-axis.

For $f(x) = 4x + 6$: set $4x + 6 = 0$. Subtracting $6$ from both sides gives $4x = -6$, and dividing by $4$ gives $x = -\\frac{6}{4} = -\\frac{3}{2}$. As a check, $f\\left(-\\frac{3}{2}\\right) = -6 + 6 = 0$.

> **Watch out.** Moving $+6$ across makes it $-6$: the root has the **opposite** sign of $\\frac{b}{a}$, here $-\\frac{3}{2}$, not $\\frac{3}{2}$. And divide by the coefficient $a$: the root is $-\\frac{b}{a}$, not $-\\frac{a}{b}$.`,
        `零点是使输出为零的输入，所以由公式求零点，就是**令函数等于 $0$ 并解出** $x$。一次函数 $f(x) = ax + b$（$a \\ne 0$）恰好有一个零点，就是它的直线与 $x$ 轴的交点。

对于 $f(x) = 4x + 6$：令 $4x + 6 = 0$。两边同时减去 $6$ 得 $4x = -6$，再除以 $4$ 得 $x = -\\frac{6}{4} = -\\frac{3}{2}$。检验：$f\\left(-\\frac{3}{2}\\right) = -6 + 6 = 0$。

> **注意。** 把 $+6$ 移到另一边就变成 $-6$：零点与 $\\frac{b}{a}$ 的符号**相反**，这里是 $-\\frac{3}{2}$，而不是 $\\frac{3}{2}$。另外，要除以系数 $a$：零点是 $-\\frac{b}{a}$，而不是 $-\\frac{a}{b}$。`,
      ),
      keyPrerequisites: ["two-step-equations"],
      generate(rng) {
        const name = rng.pick(names);
        const a = rng.sign() * rng.int(2, 9);
        const b = rng.nonZero(-15, 15);
        const root = Q.of(-b, a);
        const undo = undoConstant(b);
        const check = `${a}\\left(${root.toLatex()}\\right)${tail(b)} = ${num(-b)}${tail(b)} = 0`;
        return numberProblem({
          prompt: t(`Find the root of $${name}(x) = ${linear(a, b)}$.`, `求 $${name}(x) = ${linear(a, b)}$ 的零点。`),
          answer: root,
          solveFor: "x",
          wrong: [Q.of(b, a), Q.of(-a, b), b],
          solution: t(
            `**Step 1: set the output to zero.** A root is an input with $${name}(x) = 0$:$$${linear(a, b)} = 0.$$

**Step 2: isolate the $x$-term.** ${undo.en.replace(/^./, (c) => c.toUpperCase())}:$$${poly([a, "x"])} = ${num(-b)}.$$

**Step 3: divide by $${a}$.**$$x = ${root.toLatex()}.$$

**Check.** $${name}\\left(${root.toLatex()}\\right) = ${check}$.`,
            `**第一步：令输出为零。** 零点是满足 $${name}(x) = 0$ 的输入：$$${linear(a, b)} = 0.$$

**第二步：把含 $x$ 的项单独留下。** ${undo["zh-CN"]}：$$${poly([a, "x"])} = ${num(-b)}.$$

**第三步：两边除以 $${a}$。**$$x = ${root.toLatex()}.$$

**检验。** $${name}\\left(${root.toLatex()}\\right) = ${check}$。`,
          ),
        });
      },
    },
    {
      id: "x-and-y-intercepts",
      figure: algebraDrawings["roots-of-a-function#x-and-y-intercepts"],
      title: t("Intercepts of a graph", "图象的截距"),
      explanation: t(
        `Each axis is the set of points where one coordinate is $0$. On the $x$-axis $y = 0$, so the graph meets it at $(r, 0)$ for each root $r$; on the $y$-axis $x = 0$, so the graph meets it at $(0, f(0))$.

For $f(x) = 2x - 8$:

- $x$-intercept: $2x - 8 = 0$ gives $x = 4$, the point $(4, 0)$;
- $y$-intercept: $f(0) = 2(0) - 8 = -8$, the point $(0, -8)$.

> **Watch out.** Put the $0$ in the right place: the $x$-intercept is $(4, 0)$, not $(0, 4)$, and the $y$-intercept is $(0, -8)$, not $(-8, 0)$. For a linear function the $y$-intercept is just its constant term, while the $x$-intercept needs an equation.`,
        `每条坐标轴都是某个坐标为 $0$ 的点组成的。在 $x$ 轴上 $y = 0$，所以图象与它交于点 $(r, 0)$，其中 $r$ 是零点；在 $y$ 轴上 $x = 0$，所以图象与它交于点 $(0, f(0))$。

对于 $f(x) = 2x - 8$：

- 与 $x$ 轴的交点：由 $2x - 8 = 0$ 得 $x = 4$，即点 $(4, 0)$；
- 与 $y$ 轴的交点：$f(0) = 2(0) - 8 = -8$，即点 $(0, -8)$。

> **注意。** $0$ 要写在正确的位置：与 $x$ 轴的交点是 $(4, 0)$，不是 $(0, 4)$；与 $y$ 轴的交点是 $(0, -8)$，不是 $(-8, 0)$。对于一次函数，与 $y$ 轴的交点就是它的常数项，而与 $x$ 轴的交点需要解方程。`,
      ),
      generate(rng) {
        const name = rng.pick(names);
        const a = rng.nonZero(-6, 6);
        const b = rng.nonZero(-12, 12);
        const root = Q.of(-b, a);
        const xAxis = rng.bool();
        const answer = xAxis ? [root, Q.zero] : [Q.zero, Q.of(b)];
        const undo = undoConstant(b);
        const solved = a === 1 ? "" : `${poly([a, "x"])} = ${num(-b)} \\;\\Rightarrow\\; `;
        const p: Poly = [b, a];
        const lead = a === 1 ? "" : a === -1 ? "-" : String(a);
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
                `**Step 1: use $y = 0$.** Every point of the $x$-axis has height $0$, so set $${linear(a, b)} = 0$.

**Step 2: solve.** ${undo.en.replace(/^./, (c) => c.toUpperCase())}${a === 1 ? "" : `, then divide by $${a}$`}:$$${solved}x = ${root.toLatex()}.$$

**Step 3: write the point.** The $x$-coordinate is $${root.toLatex()}$ and the $y$-coordinate is $0$: the point is $(${root.toLatex()}, 0)$.

**Check.** $${lead}\\left(${root.toLatex()}\\right)${tail(b)} = ${num(-b)}${tail(b)} = 0$, so the point is on the graph and on the $x$-axis.`,
                `**第一步：令 $y = 0$。** $x$ 轴上每个点的高度都是 $0$，所以令 $${linear(a, b)} = 0$。

**第二步：求解。** ${undo["zh-CN"]}${a === 1 ? "" : `，再除以 $${a}$`}：$$${solved}x = ${root.toLatex()}.$$

**第三步：写出交点。** 横坐标是 $${root.toLatex()}$，纵坐标是 $0$：交点是 $(${root.toLatex()}, 0)$。

**检验。** $${lead}\\left(${root.toLatex()}\\right)${tail(b)} = ${num(-b)}${tail(b)} = 0$，所以这个点既在图象上，又在 $x$ 轴上。`,
              )
            : t(
                `**Step 1: use $x = 0$.** Every point of the $y$-axis has $x$-coordinate $0$, so evaluate at $0$:$$${name}(0) = ${substitution(p, 0)} = ${num(b)}.$$

**Step 2: write the point.** The $x$-coordinate is $0$ and the $y$-coordinate is $${num(b)}$: the point is $(0, ${num(b)})$.

**Check.** The term $${poly([a, "x"])}$ is $0$ at $x = 0$, so the $y$-intercept of a linear function is its constant term, $${num(b)}$.`,
                `**第一步：令 $x = 0$。** $y$ 轴上每个点的横坐标都是 $0$，所以计算 $x = 0$ 时的值：$$${name}(0) = ${substitution(p, 0)} = ${num(b)}.$$

**第二步：写出交点。** 横坐标是 $0$，纵坐标是 $${num(b)}$：交点是 $(0, ${num(b)})$。

**检验。** 当 $x = 0$ 时 $${poly([a, "x"])}$ 这一项为 $0$，所以一次函数与 $y$ 轴的交点就是它的常数项 $${num(b)}$。`,
              ),
        });
      },
    },
  ],
};

// Topic: increasing and decreasing functions.

/** monotoneWalk draws a piece over -5..5 that both rises and falls, with integer vertices in [-5, 5]. */
export function monotoneWalk(rng: Rng, flat: boolean): Point[] {
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
  encompasses: [],
  xp: 12,
  standards: ["CCSS.HSF.IF.B.4"],
  intro: t(
    `A line with positive slope goes up from left to right, and one with negative slope goes down. Most graphs do both: they rise in some places and fall in others, and describing **where** is one of the most useful things to know about a function.

Take again the temperature $f$, $x$ hours after midnight, whose graph runs through $(-5, 2)$, $(-2, -2)$, $(1, 5)$ and $(4, 1)$. Read left to right: it cools from $x = -5$ to $x = -2$, warms from $x = -2$ to $x = 1$, and cools again from $x = 1$ to $x = 4$:

{{figure 0}}

We say $f$ is **increasing** on $(-2, 1)$, the hours marked on the $x$-axis, and **decreasing** on $(-5, -2) \\cup (1, 4)$. These are sets of inputs, the times, not of temperatures. In this lesson we read such intervals off graphs and decide the direction of a linear function from its formula.`,
    `斜率为正的直线从左往右上升，斜率为负的直线从左往右下降。大多数图象两者兼有：有些地方上升，有些地方下降，而说清楚在**哪里**上升、哪里下降，是了解一个函数最有用的信息之一。

再看午夜后 $x$ 小时的气温 $f$，它的图象经过 $(-5, 2)$、$(-2, -2)$、$(1, 5)$ 和 $(4, 1)$。从左往右读：从 $x = -5$ 到 $x = -2$ 气温下降，从 $x = -2$ 到 $x = 1$ 上升，从 $x = 1$ 到 $x = 4$ 又下降：

{{figure 0}}

我们说 $f$ 在 $(-2, 1)$ 上**递增**（即 $x$ 轴上标出的时段），在 $(-5, -2) \\cup (1, 4)$ 上**递减**。这些是输入（时间）的集合，而不是气温的集合。这节课从图象读出这样的区间，并由一次函数的公式判断它的增减。`,
  ),
  introFigures: [
    {
      svg: plane(view, [
        ...pieceMarks([{ pts: temperatureGraph }]),
        stretchOf(temperatureGraph, -2, 1),
        ...onAxis("x", union(iv(-2, 1, false, false)), 6),
      ]),
      alt: t(
        "A graph through (−5, 2), (−2, −2), (1, 5), (4, 1). The rising part, from x = −2 to 1, is highlighted, and the x-axis is marked on (−2, 1).",
        "经过 (−5, 2)、(−2, −2)、(1, 5)、(4, 1) 的图象。上升的部分（从 x = −2 到 1）被突出显示，x 轴上标出了 (−2, 1)。",
      ),
    },
  ],
  knowledgePoints: [
    {
      id: "intervals-of-increase-and-decrease",
      figure: gradeDrawings5["increasing-and-decreasing#intervals-of-increase-and-decrease"],
      title: t("Intervals of increase and decrease", "递增区间与递减区间"),
      explanation: t(
        `A function is **increasing** on an interval if a larger input there always gives a larger output: reading the graph from left to right, it goes **up**. It is **decreasing** where the graph goes down, and **constant** where it is flat.

To find these intervals, follow the graph from left to right and note the $x$-coordinate of every turning point, where the direction changes. A graph that rises from $x = -4$ to $x = 1$ and falls from $x = 1$ to $x = 5$ is increasing on $(-4, 1)$ and decreasing on $(1, 5)$. We use **open** intervals: at the turning point itself the graph is neither going up nor going down. Separate stretches in the same direction are joined with $\\cup$.

> **Watch out.** The intervals are of **$x$-values**, read on the horizontal axis; the heights the graph passes through, such as from $-2$ to $3$, are not the answer. And write them open, $(-4, 1)$, not $[-4, 1]$.`,
        `如果在某个区间上，较大的输入总是给出较大的输出，就说函数在这个区间上**递增**：从左往右看，图象**上升**。图象下降的地方函数**递减**，水平的地方函数**不变**。

求这些区间时，从左往右沿着图象看，记下每个转折点（方向改变的地方）的 $x$ 坐标。从 $x = -4$ 上升到 $x = 1$、再从 $x = 1$ 下降到 $x = 5$ 的图象，在 $(-4, 1)$ 上递增，在 $(1, 5)$ 上递减。我们用**开区间**：在转折点本身，图象既不在上升也不在下降。方向相同的几段分开的区间用 $\\cup$ 连接。

> **注意。** 这些区间是 **$x$ 值**的区间，要在横轴上读；图象经过的高度（例如从 $-2$ 到 $3$）不是答案。另外要写成开区间 $(-4, 1)$，而不是 $[-4, 1]$。`,
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
        const stretches: { from: number; to: number; d: number }[] = [];
        for (let i = 0; i + 1 < pts.length; i++) {
          const d = Math.sign(pts[i + 1]![1] - pts[i]![1]);
          const last = stretches[stretches.length - 1];
          if (last && last.d === d) last.to = pts[i + 1]![0];
          else stretches.push({ from: pts[i]![0], to: pts[i + 1]![0], d });
        }
        const move = (d: number) => (d > 0 ? t("up", "上升") : d < 0 ? t("down", "下降") : t("flat", "水平"));
        const walkEn = stretches.map((s) => `${move(s.d).en} from $x = ${s.from}$ to $x = ${s.to}$`).join(", then ");
        const walkZh = stretches.map((s) => `从 $x = ${s.from}$ 到 $x = ${s.to}$ ${move(s.d)["zh-CN"]}`).join("，然后");
        const first = set[0]!;
        const [a, b] = [first.lo!.toNumber(), first.hi!.toNumber()];
        const [ya, yb] = [valueAt(pts, a)!, valueAt(pts, b)!];
        const many = set.length > 1;
        return annotate(
          {
            ...intervalProblem({
              prompt: t(
                `The graph of $${name}$ is shown. On which interval or intervals is $${name}$ ${word.en}? Use open intervals.`,
                `如图是 $${name}$ 的图象。$${name}$ 在哪个或哪些区间上${word["zh-CN"]}？用开区间表示。`,
              ),
              set,
              form: "interval",
              wrong: [runsOf(pts, dir === 1 ? -1 : 1), withEnds(set, true), yValues],
              solution: t(
                `**Step 1: follow the graph from left to right.** It goes ${walkEn}.

**Step 2: keep the ${move(dir).en} stretches.** $${name}$ is ${word.en} where the graph goes ${move(dir).en}: ${many ? "these stretches, joined with $\\cup$, give" : "that stretch gives"} ${setText(set)}, written as open intervals of $x$-values.

**Check.** On $(${a}, ${b})$ the height goes from $${ya}$ to $${yb}$, ${dir > 0 ? "up" : dir < 0 ? "down" : "unchanged"}, as ${word.en} requires; the answer lists inputs, not these heights.`,
                `**第一步：从左往右看图象。** 它${walkZh}。

**第二步：留下${move(dir)["zh-CN"]}的部分。** 图象${move(dir)["zh-CN"]}的地方 $${name}$ ${word["zh-CN"]}：${many ? "这几段用 $\\cup$ 连接，得到" : "这一段给出"} ${setText(set)}，写成 $x$ 值的开区间。

**检验。** 在 $(${a}, ${b})$ 上，高度从 $${ya}$ 变到 $${yb}$，${dir > 0 ? "上升了" : dir < 0 ? "下降了" : "没有变化"}，符合${word["zh-CN"]}；答案列出的是输入，而不是这些高度。`,
              ),
            }),
            figure: graphFigure([{ pts }], name),
          },
          view,
          [...set.map((i) => stretchOf(pts, i.lo!.toNumber(), i.hi!.toNumber())), ...onAxis("x", set, 6)],
          `The graph ${word.en} on ${setAlt(set)}.`,
          `图象在 ${setAlt(set)} 上${word["zh-CN"]}。`,
        );
      },
    },
    {
      id: "increasing-and-decreasing-linear-functions",
      title: t("Linear functions", "一次函数的增减性"),
      explanation: t(
        `For a linear function $f(x) = mx + b$, increasing $x$ by $1$ changes $f(x)$ by exactly $m$, the slope. So the direction is the same everywhere: $f$ is **increasing** if $m > 0$, **decreasing** if $m < 0$, and **constant** if $m = 0$. The constant term $b$ only moves the line up or down and plays no part.

Take $f(x) = 7 - 3x$. The coefficient of $x$ is $-3$, so $f$ is decreasing. Indeed $f(0) = 7$ and $f(1) = 4$: one step to the right, the output drops by $3$.

> **Watch out.** Look at the coefficient of $x$, wherever it is written: in $7 - 3x$ it comes second and is $-3$. The sign of the constant term, $7$ here, says nothing about the direction.`,
        `对于一次函数 $f(x) = mx + b$，$x$ 每增加 $1$，$f(x)$ 就恰好改变 $m$，即斜率。所以它在各处的方向都相同：$m > 0$ 时 $f$ **递增**，$m < 0$ 时**递减**，$m = 0$ 时**不变**。常数项 $b$ 只让直线上下平移，与增减无关。

看 $f(x) = 7 - 3x$。$x$ 的系数是 $-3$，所以 $f$ 递减。确实，$f(0) = 7$，$f(1) = 4$：向右走一步，输出减少 $3$。

> **注意。** 要看 $x$ 的系数，不管它写在哪里：在 $7 - 3x$ 中它写在后面，是 $-3$。常数项（这里是 $7$）的正负与增减无关。`,
      ),
      generate(rng) {
        const name = rng.pick(names);
        const m = rng.bool(0.2) ? 0 : rng.nonZero(-9, 9);
        const b = rng.nonZero(-12, 12);
        const expr = m === 0 ? num(b) : rng.bool() ? linear(m, b) : poly([b, ""], [m, "x"]);
        const options = [t("Increasing", "递增"), t("Decreasing", "递减"), t("Constant", "不变（常数函数）")];
        const correct = m > 0 ? 0 : m < 0 ? 1 : 2;
        const word = directionWord(m);
        return choiceProblem({
          prompt: t(`Is $${name}(x) = ${expr}$ increasing, decreasing or constant?`, `$${name}(x) = ${expr}$ 是递增、递减还是不变的？`),
          options,
          correct,
          solution:
            m === 0
              ? t(
                  `**Step 1: look for an $x$ term.** The formula is just the number $${num(b)}$: there is no $x$ term, so the slope is $0$.

**Step 2: decide.** Every input gives the output $${num(b)}$, so $${name}$ is constant.

**Check.** $${name}(0) = ${num(b)}$ and $${name}(1) = ${num(b)}$: one step to the right, the output does not change.`,
                  `**第一步：找 $x$ 项。** 公式只是一个数 $${num(b)}$：没有 $x$ 项，所以斜率是 $0$。

**第二步：判断。** 每个输入的输出都是 $${num(b)}$，所以 $${name}$ 不变。

**检验。** $${name}(0) = ${num(b)}$，$${name}(1) = ${num(b)}$：向右走一步，输出不变。`,
                )
              : t(
                  `**Step 1: find the coefficient of $x$.** In $${expr}$ the term with $x$ is $${poly([m, "x"])}$, so the slope is $${num(m)}$; the constant $${num(b)}$ does not matter.

**Step 2: decide.** The slope is ${m > 0 ? "positive" : "negative"}, so each step of $1$ to the right ${m > 0 ? "raises" : "lowers"} the output by $${Math.abs(m)}$: $${name}$ is ${word.en}.

**Check.** $${name}(0) = ${num(b)}$ and $${name}(1) = ${num(m + b)}$, ${m > 0 ? "larger" : "smaller"} by $${Math.abs(m)}$.`,
                  `**第一步：找 $x$ 的系数。** 在 $${expr}$ 中含 $x$ 的项是 $${poly([m, "x"])}$，所以斜率是 $${num(m)}$；常数 $${num(b)}$ 无关紧要。

**第二步：判断。** 斜率为${m > 0 ? "正" : "负"}，所以向右每走 $1$，输出${m > 0 ? "增加" : "减少"} $${Math.abs(m)}$：$${name}$ ${word["zh-CN"]}。

**检验。** $${name}(0) = ${num(b)}$，$${name}(1) = ${num(m + b)}$，${m > 0 ? "大了" : "小了"} $${Math.abs(m)}$。`,
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
    { topic: "inequalities-and-solutions", weight: 0.3 },
    { topic: "evaluating-expressions", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.IF.C.7.B"],
  intro: t(
    `A function needs one output for each input, but nothing says one formula must produce them all. Many rules in daily life change partway: a parcel service charges a flat $5$ dollars up to $2$ kilograms, and $2$ dollars per kilogram plus $1$ above that. As one function of the weight $x$:

$$f(x) = \\begin{cases} 5 & \\text{if } x \\le 2 \\\\ 2x + 1 & \\text{if } x > 2 \\end{cases}$$

A $1$-kilogram parcel satisfies $x \\le 2$, so it costs $f(1) = 5$; a $4$-kilogram one satisfies $x > 2$, so it costs $f(4) = 2(4) + 1 = 9$. The conditions you know from inequalities decide which formula to use. Here is the graph of a function with two pieces; at $x = 1$ the filled dot shows the value and the open dot shows a point left out:

{{figure 0}}

A function built this way is called **piecewise**. In this lesson we evaluate piecewise functions from their formulas and read their values from graphs.`,
    `函数要求每个输入有一个输出，但并没有规定所有输出必须由同一个公式给出。日常生活中的许多规则会在中途改变：一家快递 $2$ 千克以内一律收 $5$ 元，超过 $2$ 千克则每千克收 $2$ 元再加 $1$ 元。写成重量 $x$ 的一个函数：

$$f(x) = \\begin{cases} 5 & \\text{若 } x \\le 2 \\\\ 2x + 1 & \\text{若 } x > 2 \\end{cases}$$

$1$ 千克的包裹满足 $x \\le 2$，所以运费是 $f(1) = 5$；$4$ 千克的包裹满足 $x > 2$，所以运费是 $f(4) = 2(4) + 1 = 9$。由学过的不等式条件决定用哪个公式。下面是一个由两段组成的函数的图象；在 $x = 1$ 处，实心点表示函数值，空心点表示去掉的点：

{{figure 0}}

这样构成的函数叫做**分段函数**。这节课由公式计算分段函数的值，并从图象读出它的值。`,
  ),
  introFigures: [
    graphFigure([
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
  ],
  knowledgePoints: [
    {
      id: "evaluating-piecewise-functions",
      title: t("Evaluating piecewise functions", "分段函数求值"),
      explanation: t(
        `A **piecewise function** uses different formulas on different parts of its domain, each with a condition saying where it applies:

$$f(x) = \\begin{cases} 2x + 1 & \\text{if } x < 3 \\\\ x^{2} & \\text{if } x \\ge 3 \\end{cases}$$

The conditions never overlap, so each input has exactly one formula. To evaluate, first find the condition the input satisfies, then use that formula only. Since $1 < 3$, $f(1) = 2(1) + 1 = 3$. At the boundary, $3 < 3$ is false but $3 \\ge 3$ is true, so $f(3) = 3^{2} = 9$.

> **Watch out.** Do not use the first formula out of habit, or a formula whose condition fails. At a boundary number, read the signs carefully: $<$ leaves the number out, $\\le$ and $\\ge$ include it.`,
        `**分段函数**在定义域的不同部分使用不同的公式，每个公式都附有一个条件，说明它在哪里适用：

$$f(x) = \\begin{cases} 2x + 1 & \\text{若 } x < 3 \\\\ x^{2} & \\text{若 } x \\ge 3 \\end{cases}$$

各个条件互不重叠，所以每个输入恰好对应一个公式。求值时，先看输入满足哪个条件，再只用那一个公式。因为 $1 < 3$，所以 $f(1) = 2(1) + 1 = 3$。在分界点，$3 < 3$ 不成立而 $3 \\ge 3$ 成立，所以 $f(3) = 3^{2} = 9$。

> **注意。** 不要习惯性地用第一个公式，也不要用条件不成立的公式。在分界点处要仔细看符号：$<$ 不包含这个数，$\\le$ 和 $\\ge$ 包含它。`,
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
        const condAt = (r: Rule) => r.cond.replace("x", String(k));
        const failed = rules.filter((r) => r !== rule);
        const failEn = failed.map((r) => `$${condAt(r)}$`).join(" and ");
        const failZh = failed.map((r) => `$${condAt(r)}$`).join("、");
        const evaluate =
          rule.p.length === 1
            ? t(
                `On that piece the function is the constant $${num(value)}$, whatever the input: $${valueLatex(name, k, value)}$.`,
                `在这一段上函数是常数 $${num(value)}$，与输入无关：$${valueLatex(name, k, value)}$。`,
              )
            : t(
                `Substitute $${k}$ into $${polyLatex(rule.p)}$:${steps(`${name}(${k}) = ${substitution(rule.p, k)}`, `= ${num(value)}`)}`,
                `把 $${k}$ 代入 $${polyLatex(rule.p)}$：${steps(`${name}(${k}) = ${substitution(rule.p, k)}`, `= ${num(value)}`)}`,
              );
        return numberProblem({
          prompt: t(`Given $$${cases("if")}$$ find $${name}(${k})$.`, `已知 $$${cases("若")}$$ 求 $${name}(${k})$。`),
          answer: value,
          wrong: others,
          solution: t(
            `**Step 1: choose the piece.** With $x = ${k}$, the condition $${condAt(rule)}$ is true, so use the formula $${polyLatex(rule.p)}$.

**Step 2: evaluate.** ${evaluate.en}

**Check.** The other condition${failed.length > 1 ? "s" : ""}, ${failEn}, ${failed.length > 1 ? "are" : "is"} false, so no other formula applies at $x = ${k}$ and $${name}(${k}) = ${num(value)}$ is the only output.`,
            `**第一步：选择对应的一段。** 当 $x = ${k}$ 时，条件 $${condAt(rule)}$ 成立，所以用公式 $${polyLatex(rule.p)}$。

**第二步：求值。** ${evaluate["zh-CN"]}

**检验。** 其他条件 ${failZh} 都不成立，所以在 $x = ${k}$ 处没有别的公式适用，$${name}(${k}) = ${num(value)}$ 是唯一的输出。`,
          ),
        });
      },
    },
    {
      id: "graphs-of-piecewise-functions",
      title: t("Graphs of piecewise functions", "分段函数的图象"),
      explanation: t(
        `Each piece of a piecewise function draws its own part of the graph, so the graph often **jumps** at a boundary: the two pieces end at different heights above the same $x$. A function still has only one output there, and the dots tell which: a **filled** dot is a point of the graph, an **open** dot marks a point that is left out.

In the figure, the left piece ends with a filled dot at $(1, 3)$ and the right piece starts with an open dot at $(1, -2)$. So the point above $x = 1$ that belongs to the graph is $(1, 3)$, and $f(1) = 3$; just to the right of $1$, the values are close to $-2$.

> **Watch out.** The open dot is not on the graph, so its height is not the value. And do not split the difference: $f(1)$ is $3$, not halfway between $3$ and $-2$.`,
        `分段函数的每一段画出图象的一部分，所以图象常常在分界点处**跳跃**：两段在同一个 $x$ 的上方结束于不同的高度。函数在那里仍然只有一个输出，由点来说明是哪一个：**实心**点在图象上，**空心**点表示去掉的点。

图中左边一段在 $(1, 3)$ 处以实心点结束，右边一段在 $(1, -2)$ 处以空心点开始。所以 $x = 1$ 上方属于图象的点是 $(1, 3)$，$f(1) = 3$；在 $1$ 的右边附近，函数值接近 $-2$。

> **注意。** 空心点不在图象上，所以它的高度不是函数值。也不要取两者的中间值：$f(1)$ 是 $3$，而不是 $3$ 和 $-2$ 的中间。`,
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
        const [filledSide, openSide] = leftFilled ? [t("left", "左"), t("right", "右")] : [t("right", "右"), t("left", "左")];
        return annotate(
          {
            ...numberProblem({
              prompt: t(`The graph of $${name}$ is shown. Find $${name}(${a})$.`, `如图是 $${name}$ 的图象。求 $${name}(${a})$。`),
              answer: value,
              wrong: [other, Q.of(yl + yr, 2)],
              solution: t(
                `**Step 1: look above $x = ${a}$.** The graph jumps there. The ${filledSide.en} piece ${leftFilled ? "ends" : "starts"} with a filled dot at $(${a}, ${value})$, and the ${openSide.en} piece ${leftFilled ? "starts" : "ends"} with an open dot at $(${a}, ${other})$.

**Step 2: use the filled dot.** The open dot is left out of the graph, so the only point of the graph above $x = ${a}$ is $(${a}, ${value})$. So $${valueLatex(name, a, value)}$.

**Check.** A function has one output for each input, and here it is the height of the filled dot, $${value}$, not the open dot's $${other}$.`,
                `**第一步：看 $x = ${a}$ 的上方。** 图象在这里跳跃。${filledSide["zh-CN"]}边一段在 $(${a}, ${value})$ 处以实心点${leftFilled ? "结束" : "开始"}，${openSide["zh-CN"]}边一段在 $(${a}, ${other})$ 处以空心点${leftFilled ? "开始" : "结束"}。

**第二步：用实心点。** 空心点不在图象上，所以 $x = ${a}$ 上方属于图象的点只有 $(${a}, ${value})$。所以 $${valueLatex(name, a, value)}$。

**检验。** 函数的每个输入只有一个输出，这里就是实心点的高度 $${value}$，而不是空心点的 $${other}$。`,
              ),
            }),
            figure: graphFigure(pieces, name),
          },
          view,
          guides([a, value], spot([a, value])),
          `At x = ${a} the filled dot is at height ${value}.`,
          `当 x = ${a} 时，实心点的高度是 ${value}。`,
        );
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
    defines: t("the height in centimeters of a candle after burning for $t$ hours", "燃烧 $t$ 小时后蜡烛的高度（厘米）"),
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
  prerequisites: ["introduction-to-functions", "slope-intercept-form", "interpreting-linear-expressions"],
  encompasses: [
    { topic: "introduction-to-functions", weight: 0.4 },
    { topic: "interpreting-linear-expressions", weight: 0.4 },
  ],
  xp: 14,
  standards: ["CCSS.HSF.LE.B.5", "CCSS.HSF.IF.A.2"],
  intro: t(
    `A line $y = mx + b$ starts at height $b$ and changes by $m$ for each step to the right. Many real quantities behave exactly like this: they start at some amount and change at a steady rate. A function of that form describing a situation is a **linear model**.

A bike rental charges $4$ dollars to start and $3$ dollars per hour, so a ride of $h$ hours costs

$$C(h) = 3h + 4 \\text{ dollars}.$$

The function answers three kinds of question. Forward: a $6$-hour ride costs $C(6) = 3(6) + 4 = 22$ dollars. Backward: a $22$-dollar ride solves $3h + 4 = 22$, so it lasted $6$ hours. And about the numbers themselves: $4$ is what you pay before riding, $C(0)$, and $3$ is what each extra hour adds. In this lesson we ask all three kinds of question of linear models.`,
    `直线 $y = mx + b$ 从高度 $b$ 出发，向右每走一步改变 $m$。许多实际的量正是这样：从某个量开始，以固定的速率变化。描述这种情境的这类函数叫做**一次函数模型**。

租一辆自行车先收 $4$ 元，每小时再收 $3$ 元，所以骑 $h$ 小时的租金是

$$C(h) = 3h + 4 \\text{ 元}.$$

这个函数可以回答三类问题。正向：骑 $6$ 小时的租金是 $C(6) = 3(6) + 4 = 22$ 元。反向：租金 $22$ 元的骑行满足 $3h + 4 = 22$，所以骑了 $6$ 小时。还有关于这些数本身的问题：$4$ 是还没骑就要付的钱，即 $C(0)$；$3$ 是每多骑一小时增加的钱。这节课就对一次函数模型提出这三类问题。`,
  ),
  knowledgePoints: [
    {
      id: "evaluating-linear-models",
      title: t("Evaluating a model", "用模型求值"),
      explanation: t(
        `A linear model is a fixed amount plus a rate times the input. A taxi fare of $C(d) = 2d + 5$ dollars for a ride of $d$ kilometers is $5$ dollars fixed plus $2$ dollars for each kilometer. To answer a question about a particular input, substitute it for the variable and compute, multiplying before adding.

For a $12$ km ride:

$$C(12) = 2(12) + 5 = 24 + 5 = 29 \\text{ dollars}.$$

> **Watch out.** Only the rate is multiplied by the input: $2(12) + 5$, not $(2 + 5) \\cdot 12$. And do not leave out the fixed $5$, which is paid on every ride.`,
        `一次函数模型是一个固定量加上变化率乘以输入。行驶 $d$ 千米的出租车费 $C(d) = 2d + 5$（元）就是固定的 $5$ 元，加上每千米 $2$ 元。要回答关于某个输入的问题，就把它代入变量并计算，先乘后加。

行驶 $12$ 千米时：

$$C(12) = 2(12) + 5 = 24 + 5 = 29 \\text{ 元}.$$

> **注意。** 只有变化率乘以输入：是 $2(12) + 5$，而不是 $(2 + 5) \\cdot 12$。也不要漏掉固定的 $5$ 元，每次乘车都要付。`,
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
            `**Step 1: substitute the input.** The question is about $${c.v} = ${n}$, so replace $${c.v}$ by $${n}$ in the formula.

**Step 2: compute.** Multiply first, then add:${steps(`${c.fn}(${n}) = ${substitution([fixed, slope], n)}`, `= ${sumLatex([slope * n, fixed])}`, `= ${value}`)}

**Check.** The change from the starting amount is $${value} - ${fixed} = ${num(value - fixed)}$, which is $${n}$ times the rate $${slope}$, as it should be.`,
            `**第一步：代入输入。** 问题问的是 $${c.v} = ${n}$ 的情形，所以把公式中的 $${c.v}$ 换成 $${n}$。

**第二步：计算。** 先乘后加：${steps(`${c.fn}(${n}) = ${substitution([fixed, slope], n)}`, `= ${sumLatex([slope * n, fixed])}`, `= ${value}`)}

**检验。** 与初始量相比的变化是 $${value} - ${fixed} = ${num(value - fixed)}$，正好是变化率 $${slope}$ 的 $${n}$ 倍。`,
          ),
        });
      },
    },
    {
      id: "solving-linear-models",
      title: t("Solving for the input", "反求输入"),
      explanation: t(
        `Sometimes the output is known and the input is the question: which ride costs $29$ dollars when $C(d) = 2d + 5$? Set the formula equal to the known output and solve, undoing the operations in reverse order: first take away the fixed amount, then divide by the rate.

$$2d + 5 = 29 \\;\\Rightarrow\\; 2d = 24 \\;\\Rightarrow\\; d = 12.$$

The ride was $12$ kilometers. As a check, $C(12) = 24 + 5 = 29$.

> **Watch out.** Take away the fixed amount **before** dividing: $29 \\div 2$ treats the whole fare as kilometers and forgets the $5$ dollars to start. And the answer is the input, kilometers here, not another fare.`,
        `有时输出已知，要问的是输入：当 $C(d) = 2d + 5$ 时，车费 $29$ 元的行程有多长？令公式等于已知的输出并解方程，按相反的顺序撤销运算：先减去固定量，再除以变化率。

$$2d + 5 = 29 \\;\\Rightarrow\\; 2d = 24 \\;\\Rightarrow\\; d = 12.$$

行程是 $12$ 千米。检验：$C(12) = 24 + 5 = 29$。

> **注意。** 要**先**减去固定量再除：$29 \\div 2$ 把整个车费都当成了按千米计的部分，忘了起步的 $5$ 元。另外，答案是输入（这里是千米数），而不是另一个车费。`,
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
            `**Step 1: write the equation.** The output is $${out}$, so set the formula equal to it:$$${formula} = ${out}.$$

**Step 2: take away the fixed amount.** Subtract $${fixed}$ from both sides:$$${poly([slope, c.v])} = ${num(out - fixed)}.$$

**Step 3: divide by the rate.** Divide both sides by $${slope}$:$$${c.v} = ${n}.$$

**Check.** $${c.fn}(${n}) = ${substitution([fixed, slope], n)} = ${sumLatex([slope * n, fixed])} = ${out}$, the output we were given.`,
            `**第一步：列方程。** 输出是 $${out}$，所以令公式等于它：$$${formula} = ${out}.$$

**第二步：减去固定量。** 两边同时减去 $${fixed}$：$$${poly([slope, c.v])} = ${num(out - fixed)}.$$

**第三步：除以变化率。** 两边同时除以 $${slope}$：$$${c.v} = ${n}.$$

**检验。** $${c.fn}(${n}) = ${substitution([fixed, slope], n)} = ${sumLatex([slope * n, fixed])} = ${out}$，正是给出的输出。`,
          ),
        });
      },
    },
    {
      id: "interpreting-linear-models",
      title: t("Interpreting the numbers in a model", "解释模型中的数"),
      explanation: t(
        `Each number in a linear model $f(x) = mx + b$ has a meaning you can find by asking what it does. The constant term $b$ is the output when the input is $0$, since $f(0) = m \\cdot 0 + b = b$: the **starting amount** or fixed part. The coefficient $m$ is the **rate**: increasing the input by $1$ changes the output by $m$.

In $V(t) = 500 - 20t$, the volume of a tank in liters after $t$ minutes, $V(0) = 500$, so the tank starts with $500$ liters; and $V(1) = 480$, so it loses $20$ liters each minute.

> **Watch out.** The numbers in the formula are not the input or the output themselves: $500$ is the output at one particular input, $0$, and $20$ is a change per minute, not a time or a volume left.`,
        `一次函数模型 $f(x) = mx + b$ 中的每个数都有含义，问一问它起什么作用就能找到。常数项 $b$ 是输入为 $0$ 时的输出，因为 $f(0) = m \\cdot 0 + b = b$：它是**初始量**或固定部分。系数 $m$ 是**变化率**：输入增加 $1$，输出改变 $m$。

在表示 $t$ 分钟后水箱水量（升）的 $V(t) = 500 - 20t$ 中，$V(0) = 500$，所以水箱开始时有 $500$ 升水；$V(1) = 480$，所以每分钟减少 $20$ 升。

> **注意。** 公式中的数并不是输入或输出本身：$500$ 是某一个特定输入 $0$ 处的输出，$20$ 是每分钟的变化量，而不是时间，也不是剩余的水量。`,
      ),
      generate(rng) {
        const { c, fixed, rate, formula, slope } = model(rng);
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
                `**Step 1: find its role.** $${fixed}$ is the constant term, the part not multiplied by $${c.v}$.

**Step 2: interpret it.** At $${c.v} = 0$ the other term vanishes, so $${c.fn}(0) = ${fixed}$: the value at the very start. It represents: ${c.meanings.fixed.en.toLowerCase()}.

**Check.** $${c.fn}(0) = ${substitution([fixed, slope], 0)} = ${fixed}$, so $${fixed}$ is indeed the output when $${c.v} = 0$.`,
                `**第一步：看它的作用。** $${fixed}$ 是常数项，即不与 $${c.v}$ 相乘的部分。

**第二步：解释。** 当 $${c.v} = 0$ 时另一项为零，所以 $${c.fn}(0) = ${fixed}$：这是一开始的值。它表示${c.meanings.fixed["zh-CN"]}。

**检验。** $${c.fn}(0) = ${substitution([fixed, slope], 0)} = ${fixed}$，所以 $${fixed}$ 确实是 $${c.v} = 0$ 时的输出。`,
              )
            : t(
                `**Step 1: find its role.** ${slope > 0 ? `$${rate}$ is the coefficient of $${c.v}$` : `$${rate}$ is the size of the coefficient of $${c.v}$, which is $${slope}$`}.

**Step 2: interpret it.** Each time $${c.v}$ grows by $1$, $${c.fn}$ ${slope > 0 ? "grows" : "drops"} by $${rate}$. It represents: ${c.meanings.rate.en.toLowerCase()}.

**Check.** $${c.fn}(0) = ${fixed}$ and $${c.fn}(1) = ${fixed + slope}$: one unit of $${c.v}$ changes the output by $${slope}$.`,
                `**第一步：看它的作用。** ${slope > 0 ? `$${rate}$ 是 $${c.v}$ 的系数。` : `$${rate}$ 是 $${c.v}$ 的系数 $${slope}$ 的大小。`}

**第二步：解释。** $${c.v}$ 每增加 $1$，$${c.fn}$ 就${slope > 0 ? "增加" : "减少"} $${rate}$。它表示${c.meanings.rate["zh-CN"]}。

**检验。** $${c.fn}(0) = ${fixed}$，$${c.fn}(1) = ${fixed + slope}$：$${c.v}$ 增加一个单位，输出改变 $${slope}$。`,
              ),
        });
      },
    },
  ],
};

/** constantFrom finds b in f(x) = mx + b from one value f(x) = y, step by step. */
function constantFrom(name: string, m: number, x: number, y: number): Text {
  const b = y - m * x;
  if (x === 0)
    return t(
      `At $x = 0$ the term $${poly([m, "x"])}$ is $0$, so $b = ${valueLatex(name, 0, y)}$.`,
      `当 $x = 0$ 时 $${poly([m, "x"])}$ 这一项为 $0$，所以 $b = ${valueLatex(name, 0, y)}$。`,
    );
  const lines = steps(
    `${num(y)} = ${substitution([0, m], x)} + b`,
    `${num(y)} = ${num(m * x)} + b`,
    `b = ${num(y)}${tail(-m * x)} = ${num(b)}`,
  );
  return t(
    `Substitute the value $${valueLatex(name, x, y)}$ into $${name}(x) = ${poly([m, "x"])} + b$:${lines}`,
    `把 $${valueLatex(name, x, y)}$ 代入 $${name}(x) = ${poly([m, "x"])} + b$：${lines}`,
  );
}

export const constructingLinearFunctions: TopicDef = {
  id: "constructing-linear-functions",
  title: t("Constructing Linear Functions", "构造一次函数"),
  summary: t(
    "Write the formula of a linear function from a description, a table of values, or two of its values.",
    "根据文字描述、数值表或两个函数值写出一次函数的解析式。",
  ),
  prerequisites: ["modeling-with-linear-functions", "representations-of-functions", "point-slope-form"],
  encompasses: [
    { topic: "representations-of-functions", weight: 0.3 },
    { topic: "slope-of-a-line", weight: 0.3 },
  ],
  xp: 16,
  standards: ["CCSS.HSF.LE.A.2", "CCSS.HSF.BF.A.1.A"],
  intro: t(
    `Using a linear model means starting from its formula. Usually the formula is not given: you know the situation, a few measurements or a table, and must **build** the function yourself. Every linear function is $f(x) = mx + b$, so building one means finding two numbers: the rate $m$ and the starting value $b$.

A candle is $30$ cm tall and burns down $2$ cm per hour. The starting length is $30$ and the length goes **down** by $2$ each hour, so after $t$ hours

$$L(t) = 30 - 2t.$$

The same two numbers can come from data instead. If a table shows $L(0) = 30$ and $L(5) = 20$, the length fell $10$ cm in $5$ hours, $2$ per hour, giving the same formula. In this lesson we construct linear functions from descriptions, from tables and from two values.`,
    `使用一次函数模型，要从它的公式出发。但公式通常不是现成的：我们知道情境、几次测量或一张表，要自己**构造**出函数。每个一次函数都是 $f(x) = mx + b$，所以构造它就是求出两个数：变化率 $m$ 和初始值 $b$。

一支蜡烛长 $30$ 厘米，每小时烧短 $2$ 厘米。初始长度是 $30$，每小时**减少** $2$，所以 $t$ 小时后

$$L(t) = 30 - 2t.$$

这两个数也可以从数据得到。如果一张表给出 $L(0) = 30$ 和 $L(5) = 20$，那么 $5$ 小时里长度减少了 $10$ 厘米，即每小时 $2$ 厘米，得到同一个公式。这节课分别由文字描述、数值表和两个函数值构造一次函数。`,
  ),
  knowledgePoints: [
    {
      id: "linear-functions-from-a-description",
      title: t("From a description", "由文字描述构造"),
      explanation: t(
        `A situation with a starting amount and a constant rate gives a linear function:

$$\\text{output} = \\text{starting amount} + \\text{rate} \\times \\text{input}.$$

The starting amount stands alone, because it is there before the input counts anything; the rate is multiplied by the input, because it is added once for each unit. For an amount that goes down, the rate is negative. A tank holding $500$ liters that drains $20$ liters per minute holds $V(t) = 500 - 20t$, or $-20t + 500$, liters after $t$ minutes.

> **Watch out.** The rate goes with the variable and the starting amount stands alone: $500t - 20$ swaps them. And a quantity that decreases needs the minus sign: $500 + 20t$ would fill the tank instead.`,
        `有初始量和固定变化率的情境给出一个一次函数：

$$\\text{输出} = \\text{初始量} + \\text{变化率} \\times \\text{输入}.$$

初始量单独一项，因为在输入开始计数之前它就存在；变化率与输入相乘，因为每一个单位都要加一次。对于减少的量，变化率是负数。装有 $500$ 升水、每分钟排水 $20$ 升的水箱，$t$ 分钟后的水量为 $V(t) = 500 - 20t$，即 $-20t + 500$ 升。

> **注意。** 变化率跟着变量，初始量单独一项：$500t - 20$ 把两者弄反了。另外，减少的量要带负号：$500 + 20t$ 表示的是水箱在加水。`,
      ),
      generate(rng) {
        const { c, fixed, rate, slope, formula, at } = model(rng);
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
              `**Step 1: the starting amount.** At $${c.v} = 0$ the amount is $${fixed}$: this is the constant term.

**Step 2: the rate.** Each unit of $${c.v}$ ${c.grows ? "adds" : "takes away"} $${rate}$, so the coefficient of $${c.v}$ is $${slope}$.

**Step 3: put them together.**$$${lhs} = ${formula}.$$

**Check.** After $2$ units the amount should be $${fixed}$ ${c.grows ? "plus" : "minus"} twice $${rate}$, which is $${at(2)}$; the formula gives $${c.fn}(2) = ${substitution([fixed, slope], 2)} = ${at(2)}$.`,
              `**第一步：初始量。** 当 $${c.v} = 0$ 时量是 $${fixed}$：这是常数项。

**第二步：变化率。** $${c.v}$ 每增加一个单位就${c.grows ? "增加" : "减少"} $${rate}$，所以 $${c.v}$ 的系数是 $${slope}$。

**第三步：合起来。**$$${lhs} = ${formula}.$$

**检验。** 经过 $2$ 个单位后，量应是 $${fixed}$ ${c.grows ? "加上" : "减去"} $${rate}$ 的两倍，即 $${at(2)}$；公式给出 $${c.fn}(2) = ${substitution([fixed, slope], 2)} = ${at(2)}$。`,
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
        `In a table of a linear function, equal steps in $x$ give equal steps in $f(x)$, and the rate $m$ is the change in $f(x)$ divided by the change in $x$:

$$\\begin{array}{c|cccc} x & 1 & 3 & 5 & 7 \\\\ \\hline f(x) & 4 & 10 & 16 & 22 \\end{array} \\qquad m = \\frac{10 - 4}{3 - 1} = \\frac{6}{2} = 3.$$

Then find the constant term from any column. The first column says $f(1) = 4$, so $3(1) + b = 4$ and $b = 1$: the function is $f(x) = 3x + 1$. The last column checks it: $3(7) + 1 = 22$.

> **Watch out.** Divide by the step in $x$: here the outputs grow by $6$ while $x$ grows by $2$, so the rate is $3$, not $6$. And the first output is $f(0) = b$ only when the table starts at $x = 0$; here it starts at $x = 1$.`,
        `在一次函数的数值表中，$x$ 每次变化相同的量，$f(x)$ 也每次变化相同的量，变化率 $m$ 等于 $f(x)$ 的变化量除以 $x$ 的变化量：

$$\\begin{array}{c|cccc} x & 1 & 3 & 5 & 7 \\\\ \\hline f(x) & 4 & 10 & 16 & 22 \\end{array} \\qquad m = \\frac{10 - 4}{3 - 1} = \\frac{6}{2} = 3.$$

再用任意一列求常数项。第一列说明 $f(1) = 4$，所以 $3(1) + b = 4$，$b = 1$：函数是 $f(x) = 3x + 1$。用最后一列检验：$3(7) + 1 = 22$。

> **注意。** 要除以 $x$ 的步长：这里输出每次增加 $6$，而 $x$ 每次增加 $2$，所以变化率是 $3$，不是 $6$。另外，只有当表从 $x = 0$ 开始时，第一个输出才是 $f(0) = b$；这里是从 $x = 1$ 开始的。`,
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
        const rateLine =
          step === 1
            ? `m = ${num(ys[1]!)} - ${paren(ys[0]!)} = ${num(m)}`
            : `m = \\frac{${num(ys[1]!)} - ${paren(ys[0]!)}}{${num(xs[1]!)} - ${paren(xs[0]!)}} = \\frac{${num(m * step)}}{${step}} = ${num(m)}`;
        const from = constantFrom(name, m, xs[0]!, ys[0]!);
        const last = [xs[3]!, ys[3]!] as const;
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
              `**Step 1: the rate.** From column to column, $x$ grows by $${step}$ and $${name}(x)$ changes by $${num(m * step)}$. ${step === 1 ? "Since the step in $x$ is $1$, that change is the rate:" : "Divide by the step in $x$:"}$$${rateLine}.$$

**Step 2: the constant term.** ${from.en}

**Step 3: write the formula.** $${name}(x) = ${answer}$.

**Check.** The last column: $${name}(${last[0]}) = ${substitution([b, m], last[0])} = ${num(last[1])}$, as in the table.`,
              `**第一步：变化率。** 从一列到下一列，$x$ 增加 $${step}$，$${name}(x)$ 改变 $${num(m * step)}$。${step === 1 ? "$x$ 的步长是 $1$，所以这个变化量就是变化率：" : "除以 $x$ 的步长："}$$${rateLine}.$$

**第二步：常数项。** ${from["zh-CN"]}

**第三步：写出解析式。** $${name}(x) = ${answer}$。

**检验。** 用最后一列：$${name}(${last[0]}) = ${substitution([b, m], last[0])} = ${num(last[1])}$，与表中一致。`,
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
        `Two values of a linear function determine it, just as two points determine a line. If $f(2) = 7$ and $f(5) = 16$, the output grows by $16 - 7 = 9$ while the input grows by $5 - 2 = 3$:

$$m = \\frac{16 - 7}{5 - 2} = \\frac{9}{3} = 3.$$

Then substitute one of the values to find $b$: $3(2) + b = 7$ gives $b = 1$, so $f(x) = 3x + 1$. The other value checks it: $f(5) = 15 + 1 = 16$.

> **Watch out.** Subtract in the same order on top and bottom, output of the second minus output of the first over input of the second minus input of the first; mixing the orders flips the sign. And $b$ is not one of the given outputs: it is $f(0)$, which has to be worked out.`,
        `一次函数由它的两个函数值确定，就像两点确定一条直线。若 $f(2) = 7$，$f(5) = 16$，则输入增加 $5 - 2 = 3$ 时，输出增加 $16 - 7 = 9$：

$$m = \\frac{16 - 7}{5 - 2} = \\frac{9}{3} = 3.$$

再代入其中一个值求 $b$：由 $3(2) + b = 7$ 得 $b = 1$，所以 $f(x) = 3x + 1$。用另一个值检验：$f(5) = 15 + 1 = 16$。

> **注意。** 分子分母要按相同的顺序相减：第二个输出减第一个输出，除以第二个输入减第一个输入；顺序不一致会使符号反过来。另外，$b$ 不是给出的某个输出：它是 $f(0)$，需要算出来。`,
      ),
      generate(rng) {
        const name = rng.pick(names);
        const m = rng.nonZero(-6, 6);
        const b = rng.int(-10, 10);
        const x1 = rng.int(-5, 4);
        const x2 = x1 + rng.int(1, 5);
        const [y1, y2] = [m * x1 + b, m * x2 + b];
        const answer = linear(m, b);
        const rateLine = `m = \\frac{${num(y2)} - ${paren(y1)}}{${num(x2)} - ${paren(x1)}} = \\frac{${num(y2 - y1)}}{${x2 - x1}} = ${num(m)}`;
        const from = constantFrom(name, m, x1, y1);
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
              `**Step 1: the rate.** Divide the change in output by the change in input:$$${rateLine}.$$

**Step 2: the constant term.** ${from.en}

**Step 3: write the formula.** $${name}(x) = ${answer}$.

**Check.** The other value: $${name}(${x2}) = ${substitution([b, m], x2)} = ${num(y2)}$, as given.`,
              `**第一步：变化率。** 用输出的变化量除以输入的变化量：$$${rateLine}.$$

**第二步：常数项。** ${from["zh-CN"]}

**第三步：写出解析式。** $${name}(x) = ${answer}$。

**检验。** 用另一个值：$${name}(${x2}) = ${substitution([b, m], x2)} = ${num(y2)}$，与给出的一致。`,
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

/** Term is a coefficient and a power of x. */
type Term = readonly [number, number];

/** termsOf lists the nonzero terms of a polynomial from the highest power down. */
const termsOf = (p: Poly, sign = 1): Term[] =>
  p
    .map((c, i): Term => [sign * c, i])
    .filter(([c]) => c !== 0)
    .reverse();

/** termsLatex writes terms in the order given, without collecting like terms: "2x^{2} + 3x - 4x - 6". */
function termsLatex(terms: readonly Term[]): string {
  const shown = terms.filter(([c]) => c !== 0);
  if (shown.length === 0) return "0";
  return shown
    .map(([c, i], k) => {
      const a = Math.abs(c);
      const body = `${a === 1 && i > 0 ? "" : a}${i === 0 ? "" : i === 1 ? "x" : `x^{${i}}`}`;
      return k === 0 ? (c < 0 ? `-${body}` : body) : c < 0 ? ` - ${body}` : ` + ${body}`;
    })
    .join("");
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
    { topic: "introduction-to-functions", weight: 0.3 },
  ],
  xp: 15,
  standards: ["CCSS.HSF.BF.A.1.B"],
  intro: t(
    `You can add, subtract and multiply polynomials. Since the outputs of functions are numbers, two functions can be combined the same way, **input by input**, to make a new function.

A stall sells juice at $5$ dollars a cup, so selling $x$ cups brings in $R(x) = 5x$ dollars, and it costs $C(x) = 2x + 30$ dollars to make them. The profit is what comes in minus what goes out, for each number of cups:

$$P(x) = R(x) - C(x) = 5x - (2x + 30) = 3x - 30.$$

At $x = 20$ cups, $R(20) = 100$ and $C(20) = 70$, so the profit is $30$, and the new formula agrees: $3(20) - 30 = 30$. We write this new function as $R - C$. In this lesson we add, subtract, multiply and divide functions, both as formulas and at a single input.`,
    `我们会对多项式做加、减、乘法。函数的输出是数，所以两个函数也能以同样的方式**按每个输入**组合起来，得到一个新函数。

一个小摊卖果汁，每杯 $5$ 元，卖出 $x$ 杯的收入是 $R(x) = 5x$ 元，制作这些果汁的成本是 $C(x) = 2x + 30$ 元。对每一个杯数，利润都是收入减去成本：

$$P(x) = R(x) - C(x) = 5x - (2x + 30) = 3x - 30.$$

卖出 $x = 20$ 杯时，$R(20) = 100$，$C(20) = 70$，所以利润是 $30$，新公式也给出同样的结果：$3(20) - 30 = 30$。这个新函数记作 $R - C$。这节课对函数做加、减、乘、除，既求公式，也求在某一个输入处的值。`,
  ),
  knowledgePoints: [
    {
      id: "adding-and-subtracting-functions",
      title: t("Adding and subtracting functions", "函数的加减"),
      explanation: t(
        `The sum and difference of two functions are defined input by input:

$$(f + g)(x) = f(x) + g(x), \\qquad (f - g)(x) = f(x) - g(x).$$

So to find the formula, put the two formulas together, with $g(x)$ in parentheses, and collect like terms. For $f(x) = x^{2} + 3x$ and $g(x) = 2x - 5$:

$$(f - g)(x) = x^{2} + 3x - (2x - 5) = x^{2} + 3x - 2x + 5 = x^{2} + x + 5.$$

The minus sign in front of the parentheses changes the sign of **every** term of $g(x)$, so $-(-5)$ becomes $+5$.

> **Watch out.** Subtracting only the first term of $g$, writing $x^{2} + 3x - 2x - 5$, is the usual slip. And $f - g$ is not $g - f$: the order matters for subtraction.`,
        `两个函数的和与差是对每个输入分别定义的：

$$(f + g)(x) = f(x) + g(x), \\qquad (f - g)(x) = f(x) - g(x).$$

所以求公式时，把两个公式写在一起（$g(x)$ 加括号），再合并同类项。对于 $f(x) = x^{2} + 3x$ 和 $g(x) = 2x - 5$：

$$(f - g)(x) = x^{2} + 3x - (2x - 5) = x^{2} + 3x - 2x + 5 = x^{2} + x + 5.$$

括号前的减号会改变 $g(x)$ **每一项**的符号，所以 $-(-5)$ 变成 $+5$。

> **注意。** 常见的错误是只减去 $g$ 的第一项，写成 $x^{2} + 3x - 2x - 5$。另外，$f - g$ 不等于 $g - f$：减法的顺序很重要。`,
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
        const open = termsLatex([...termsOf(f), ...termsOf(g, minus ? -1 : 1)]);
        const [f1, g1, a1] = [evalPoly(f, 1), evalPoly(g, 1), evalPoly(answer, 1)];
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
              `**Step 1: write out the definition.** $${lhs}$ means $f(x) ${op} g(x)$:$$${lhs} = ${polyLatex(f)} ${op} (${polyLatex(g)}).$$

**Step 2: remove the parentheses.** ${minus ? "The minus sign changes the sign of every term of $g(x)$:" : "Adding leaves every term of $g(x)$ as it is:"}$$${lhs} = ${open}.$$

**Step 3: collect like terms.**$$${lhs} = ${polyLatex(answer)}.$$

**Check.** At $x = 1$: $f(1) ${op} g(1) = ${num(f1)} ${op} ${paren(g1)} = ${num(minus ? f1 - g1 : f1 + g1)}$, and the answer gives $${num(a1)}$ too.`,
              `**第一步：写出定义。** $${lhs}$ 就是 $f(x) ${op} g(x)$：$$${lhs} = ${polyLatex(f)} ${op} (${polyLatex(g)}).$$

**第二步：去括号。** ${minus ? "减号改变 $g(x)$ 每一项的符号：" : "做加法时 $g(x)$ 的各项不变："}$$${lhs} = ${open}.$$

**第三步：合并同类项。**$$${lhs} = ${polyLatex(answer)}.$$

**检验。** 当 $x = 1$ 时：$f(1) ${op} g(1) = ${num(f1)} ${op} ${paren(g1)} = ${num(minus ? f1 - g1 : f1 + g1)}$，答案在 $x = 1$ 处的值也是 $${num(a1)}$。`,
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
        `The product of two functions is defined the same way, input by input: $(fg)(x) = f(x) \\cdot g(x)$. To find its formula, multiply the two formulas as polynomials, **every term by every term**, then collect like terms.

For $f(x) = x + 4$ and $g(x) = 2x - 3$:

$$(fg)(x) = (x + 4)(2x - 3) = 2x^{2} - 3x + 8x - 12 = 2x^{2} + 5x - 12.$$

The two middle products, $-3x$ and $8x$, are like terms and combine into $5x$.

> **Watch out.** Multiplying only the first terms and the last terms, $2x^{2} - 12$, loses the middle products. And $fg$ means the product, not the sum $f + g$.`,
        `两个函数的积也按每个输入定义：$(fg)(x) = f(x) \\cdot g(x)$。求它的公式，就把两个公式当作多项式相乘，**每一项都乘以另一个的每一项**，再合并同类项。

对于 $f(x) = x + 4$ 和 $g(x) = 2x - 3$：

$$(fg)(x) = (x + 4)(2x - 3) = 2x^{2} - 3x + 8x - 12 = 2x^{2} + 5x - 12.$$

中间的两个乘积 $-3x$ 和 $8x$ 是同类项，合并为 $5x$。

> **注意。** 只把首项相乘、末项相乘，得到 $2x^{2} - 12$，就漏掉了中间的乘积。另外，$fg$ 表示乘积，而不是和 $f + g$。`,
      ),
      keyPrerequisites: ["multiplying-binomials"],
      generate(rng) {
        const f: Poly = [rng.nonZero(-9, 9), rng.nonZero(-4, 4)];
        const g: Poly = [rng.nonZero(-9, 9), rng.nonZero(-4, 4)];
        const answer = mulPoly(f, g);
        const expanded = termsLatex([
          [f[1]! * g[1]!, 2],
          [f[1]! * g[0]!, 1],
          [f[0]! * g[1]!, 1],
          [f[0]! * g[0]!, 0],
        ]);
        const [f1, g1] = [evalPoly(f, 1), evalPoly(g, 1)];
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
              `**Step 1: write out the definition.** $(fg)(x) = f(x) \\cdot g(x)$:$$(fg)(x) = (${polyLatex(f)})(${polyLatex(g)}).$$

**Step 2: multiply every term by every term.** Each of the two terms of $f(x)$ times each of the two terms of $g(x)$ gives four products:$$(fg)(x) = ${expanded}.$$

**Step 3: collect like terms.** The two products with $x$ combine:$$(fg)(x) = ${polyLatex(answer)}.$$

**Check.** At $x = 1$: $f(1) \\cdot g(1) = ${paren(f1)} \\cdot ${paren(g1)} = ${num(f1 * g1)}$, and the answer gives $${num(evalPoly(answer, 1))}$ too.`,
              `**第一步：写出定义。** $(fg)(x) = f(x) \\cdot g(x)$：$$(fg)(x) = (${polyLatex(f)})(${polyLatex(g)}).$$

**第二步：每一项乘以每一项。** $f(x)$ 的两项分别乘以 $g(x)$ 的两项，得到四个乘积：$$(fg)(x) = ${expanded}.$$

**第三步：合并同类项。** 两个含 $x$ 的乘积合并：$$(fg)(x) = ${polyLatex(answer)}.$$

**检验。** 当 $x = 1$ 时：$f(1) \\cdot g(1) = ${paren(f1)} \\cdot ${paren(g1)} = ${num(f1 * g1)}$，答案在 $x = 1$ 处的值也是 $${num(evalPoly(answer, 1))}$。`,
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
        `To evaluate a combination at one number, there is no need to find its formula: evaluate each function there first, then combine the two outputs.

$$\\left(\\frac{f}{g}\\right)(2) = \\frac{f(2)}{g(2)}, \\qquad (f - g)(2) = f(2) - g(2).$$

If $f(2) = 9$ and $g(2) = -3$, then $\\left(\\frac{f}{g}\\right)(2) = \\frac{9}{-3} = -3$ and $(f - g)(2) = 9 - (-3) = 12$. A quotient has no value at an input where the denominator $g$ is $0$.

> **Watch out.** Keep the order: $\\frac{f}{g}$ puts $f(2)$ on top and $f - g$ subtracts $g(2)$ from $f(2)$. And subtracting a negative output adds it: $9 - (-3)$ is $12$, not $6$.`,
        `求函数运算在某一个数处的值，不必先求出它的公式：先分别求出各函数在该处的值，再把两个输出组合起来。

$$\\left(\\frac{f}{g}\\right)(2) = \\frac{f(2)}{g(2)}, \\qquad (f - g)(2) = f(2) - g(2).$$

若 $f(2) = 9$，$g(2) = -3$，则 $\\left(\\frac{f}{g}\\right)(2) = \\frac{9}{-3} = -3$，$(f - g)(2) = 9 - (-3) = 12$。在使分母 $g$ 为 $0$ 的输入处，商没有值。

> **注意。** 要保持顺序：$\\frac{f}{g}$ 把 $f(2)$ 放在分子上，$f - g$ 是从 $f(2)$ 中减去 $g(2)$。另外，减去一个负的输出等于加上它：$9 - (-3)$ 是 $12$，不是 $6$。`,
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
        const combined = [addPoly(f, g), addPoly(f, g, -1), mulPoly(f, g)][kind];
        const check =
          combined === undefined
            ? t(
                `Multiplying back, $${value.toLatex()} \\cdot ${paren(gk)} = ${num(fk)}$, which is $f(${k})$.`,
                `反过来相乘：$${value.toLatex()} \\cdot ${paren(gk)} = ${num(fk)}$，正是 $f(${k})$。`,
              )
            : t(
                `Combining the formulas first gives $${lhs.replace(`(${k})`, "(x)")} = ${polyLatex(combined)}$, and at $x = ${k}$ this is $${num(evalPoly(combined, k))}$ too.`,
                `先合并公式得 $${lhs.replace(`(${k})`, "(x)")} = ${polyLatex(combined)}$，它在 $x = ${k}$ 处的值也是 $${num(evalPoly(combined, k))}$。`,
              );
        return numberProblem({
          prompt: t(
            `Given $f(x) = ${polyLatex(f)}$ and $g(x) = ${polyLatex(g)}$, find $${lhs}$.`,
            `已知 $f(x) = ${polyLatex(f)}$，$g(x) = ${polyLatex(g)}$，求 $${lhs}$。`,
          ),
          answer: value,
          wrong,
          solution: t(
            `**Step 1: evaluate $f$.** $$f(${k}) = ${substitution(f, k)} = ${num(fk)}.$$

**Step 2: evaluate $g$.** $$g(${k}) = ${substitution(g, k)} = ${num(gk)}.$$

**Step 3: combine the outputs.**${steps(`${lhs} = ${combine}${result}`)}

**Check.** ${check.en}`,
            `**第一步：求 $f$ 的值。** $$f(${k}) = ${substitution(f, k)} = ${num(fk)}.$$

**第二步：求 $g$ 的值。** $$g(${k}) = ${substitution(g, k)} = ${num(gk)}.$$

**第三步：组合两个输出。**${steps(`${lhs} = ${combine}${result}`)}

**检验。** ${check["zh-CN"]}`,
          ),
        });
      },
    },
  ],
};

// Topic: function composition.

/** machineFigure draws a composition as two machines in a row: an input goes into g, its output into f. */
function machineFigure(input: number, mid: number, out: number): Figure {
  const arrow = (x1: number, x2: number) =>
    `<g class="accent"><line x1="${x1}" y1="30" x2="${x2 - 6}" y2="30"/><polygon points="${x2},30 ${x2 - 8},26 ${x2 - 8},34" fill="currentColor"/></g>`;
  const body =
    `<rect x="70" y="12" width="50" height="36" rx="4"/><rect x="190" y="12" width="50" height="36" rx="4"/>` +
    `${arrow(34, 68)}${arrow(122, 148)}${arrow(172, 188)}${arrow(242, 270)}` +
    `<g stroke="none" fill="currentColor" text-anchor="middle"><text x="20" y="35">${input}</text><text x="95" y="35" font-style="italic">g</text>` +
    `<text x="160" y="35">${mid}</text><text x="215" y="35" font-style="italic">f</text><text x="292" y="35">${out}</text></g>`;
  return {
    svg: svgDocument(60, body),
    alt: t(
      `Two machines in a row: the input ${input} goes into g, which gives ${mid}; ${mid} goes into f, which gives ${out}.`,
      `两台机器排成一行：输入 ${input} 进入 g，得到 ${mid}；${mid} 再进入 f，得到 ${out}。`,
    ),
  };
}

/** composeSteps writes the substitution of one polynomial into another, the expanded terms and the result. */
function composeSteps(lhs: string, on: Poly, ii: Poly): string {
  const inner = polyLatex(ii);
  const lines = [`${lhs} = ${substitutionOf(on, inner)}`];
  const coef = (c: number) => (c === 1 ? "" : c === -1 ? "-" : String(c));
  if (on.length === 3 && on[2] !== 0) {
    const sq = mulPoly(ii, ii);
    let s = `${coef(on[2]!)}(${polyLatex(sq)})`;
    if (on[1]) s += `${on[1] < 0 ? " - " : " + "}${coef(Math.abs(on[1]))}(${inner})`;
    if (on[0]) s += tail(on[0]);
    lines.push(`= ${s}`);
  }
  let power: Poly = [1];
  const terms: Term[] = [];
  const pieces: Term[][] = [];
  for (const c of on) {
    pieces.push(termsOf(power, c));
    power = mulPoly(power, ii);
  }
  for (const p of pieces.reverse()) terms.push(...p);
  lines.push(`= ${termsLatex(terms)}`, `= ${polyLatex(composePoly(on, ii))}`);
  return steps(...lines);
}

export const functionComposition: TopicDef = {
  id: "function-composition",
  title: t("Function Composition", "函数的复合"),
  summary: t(
    "Compose functions: evaluate f(g(x)) at a number, from tables, and as a formula.",
    "复合函数：在某个数处、借助数值表以及以公式形式求 f(g(x))。",
  ),
  prerequisites: ["arithmetic-of-functions", "representations-of-functions", "squaring-binomials"],
  encompasses: [{ topic: "introduction-to-functions", weight: 0.5 }],
  xp: 16,
  standards: ["CCSS.HSF.BF.A.1.C"],
  intro: t(
    `Adding or multiplying two functions combines their outputs side by side. There is another way to combine functions: **one after the other**, feeding the output of the first in as the input of the second.

Think of each function as a machine. With $g(x) = 2x + 1$ and $f(x) = x^{2} - 3$, put $3$ into $g$ to get $g(3) = 7$, then put that $7$ into $f$ to get $f(7) = 46$:

{{figure 0}}

The whole chain is a new function, written $f(g(x))$ or $(f \\circ g)(x)$, read "$f$ of $g$ of $x$". It describes any process done in stages, such as a price discounted and then taxed. In this lesson we evaluate compositions at numbers, read them from tables, and find their formulas.`,
    `两个函数相加或相乘，是把它们的输出并排组合。还有另一种组合函数的方式：**一个接着一个**，把第一个函数的输出作为第二个函数的输入。

把每个函数想象成一台机器。设 $g(x) = 2x + 1$，$f(x) = x^{2} - 3$。把 $3$ 放进 $g$，得到 $g(3) = 7$；再把这个 $7$ 放进 $f$，得到 $f(7) = 46$：

{{figure 0}}

整条链是一个新函数，记作 $f(g(x))$ 或 $(f \\circ g)(x)$，读作"$f$ 复合 $g$"。它可以描述分几个阶段完成的过程，比如先打折、再加税的价格。这节课在某个数处求复合函数的值，从数值表读出它，并求出它的公式。`,
  ),
  introFigures: [machineFigure(3, 7, 46)],
  knowledgePoints: [
    {
      id: "evaluating-compositions",
      title: t("Evaluating a composition", "复合函数求值"),
      explanation: t(
        `The **composition** $f \\circ g$ applies $g$ first and then $f$: $(f \\circ g)(x) = f(g(x))$. Work from the inside out: the innermost parentheses are computed first, and their value becomes the input of the outer function.

For $f(x) = x^{2} + 1$ and $g(x) = 3x - 2$:

$$g(2) = 3(2) - 2 = 4, \\qquad f(g(2)) = f(4) = 4^{2} + 1 = 17.$$

> **Watch out.** The order matters: $g(f(2)) = g(5) = 13$ is a different number. And a composition is not a product: $f(2) \\cdot g(2) = 5 \\cdot 4 = 20$ is something else again.`,
        `**复合函数** $f \\circ g$ 先作用 $g$，再作用 $f$：$(f \\circ g)(x) = f(g(x))$。从里往外算：先算最里层括号，它的值成为外层函数的输入。

对于 $f(x) = x^{2} + 1$ 和 $g(x) = 3x - 2$：

$$g(2) = 3(2) - 2 = 4, \\qquad f(g(2)) = f(4) = 4^{2} + 1 = 17.$$

> **注意。** 顺序很重要：$g(f(2)) = g(5) = 13$ 是另一个数。另外，复合不是乘积：$f(2) \\cdot g(2) = 5 \\cdot 4 = 20$ 又是另一回事。`,
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
        const other = evalPoly(ii, evalPoly(on, k));
        return numberProblem({
          prompt: t(
            `Given $f(x) = ${polyLatex(f)}$ and $g(x) = ${polyLatex(g)}$, find $${lhs}$.`,
            `已知 $f(x) = ${polyLatex(f)}$，$g(x) = ${polyLatex(g)}$，求 $${lhs}$。`,
          ),
          answer: value,
          wrong: [other, evalPoly(f, k) * evalPoly(g, k), evalPoly(on, k)],
          solution: t(
            `**Step 1: the inner function.** $${inner}$ acts first:$$${inner}(${k}) = ${substitution(ii, k)} = ${num(mid)}.$$

**Step 2: the outer function.** Its output $${num(mid)}$ is the input of $${outer}$:$$${outer}(${num(mid)}) = ${substitution(on, mid)} = ${num(value)}.$$

So $${lhs} = ${num(value)}$.

**Check.** Composing the formulas first gives $${outer}(${inner}(x)) = ${polyLatex(composePoly(on, ii))}$, which is $${num(evalPoly(composePoly(on, ii), k))}$ at $x = ${k}$.${other === value ? "" : ` The other order would give $${num(other)}$, a different number.`}`,
            `**第一步：内层函数。** 先作用 $${inner}$：$$${inner}(${k}) = ${substitution(ii, k)} = ${num(mid)}.$$

**第二步：外层函数。** 它的输出 $${num(mid)}$ 是 $${outer}$ 的输入：$$${outer}(${num(mid)}) = ${substitution(on, mid)} = ${num(value)}.$$

所以 $${lhs} = ${num(value)}$。

**检验。** 先复合公式得 $${outer}(${inner}(x)) = ${polyLatex(composePoly(on, ii))}$，它在 $x = ${k}$ 处的值是 $${num(evalPoly(composePoly(on, ii), k))}$。${other === value ? "" : `反过来的顺序会得到 $${num(other)}$，是另一个数。`}`,
          ),
        });
      },
    },
    {
      id: "compositions-from-tables",
      title: t("Compositions from tables", "由数值表求复合函数值"),
      explanation: t(
        `A composition only needs the values of the two functions, so it can be found from tables alone. Read the inner function's output, then look that number up as an **input** of the outer function.

To find $f(g(1))$: in the table of $g$, find $1$ in the $x$ row and read $g(1)$ below it, say $g(1) = 3$. Then in the table of $f$, find $3$ in the $x$ row and read $f(3)$ below it, say $f(3) = -2$. So $f(g(1)) = -2$.

> **Watch out.** The middle number $g(1) = 3$ is not the answer, only a stop on the way. And look it up in the $x$ row of $f$, not in the row of outputs.`,
        `复合函数只需要两个函数的值，所以只用数值表就能求出。先读出内层函数的输出，再把这个数作为外层函数的**输入**去查表。

求 $f(g(1))$：在 $g$ 的表中，在 $x$ 行找到 $1$，读出它下面的 $g(1)$，比如 $g(1) = 3$。再在 $f$ 的表中，在 $x$ 行找到 $3$，读出它下面的 $f(3)$，比如 $f(3) = -2$。所以 $f(g(1)) = -2$。

> **注意。** 中间的数 $g(1) = 3$ 不是答案，只是途中的一站。另外，要在 $f$ 的 $x$ 行里找它，而不是在输出那一行里找。`,
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
            `**Step 1: the inner function.** In the table of $g$, the input $${a}$ has the output $${valueLatex("g", a, mid)}$.

**Step 2: the outer function.** Now $${mid}$ is the input of $f$. In the table of $f$, the input $${mid}$ has the output $${valueLatex("f", mid, value)}$. So $f(g(${a})) = ${value}$.

**Check.** $${mid}$ appears in the $x$ row of $f$, so it is a valid input of $f$, and the answer $${value}$ is read from the row of outputs of $f$ below it.`,
            `**第一步：内层函数。** 在 $g$ 的表中，输入 $${a}$ 的输出是 $${valueLatex("g", a, mid)}$。

**第二步：外层函数。** 现在 $${mid}$ 是 $f$ 的输入。在 $f$ 的表中，输入 $${mid}$ 的输出是 $${valueLatex("f", mid, value)}$。所以 $f(g(${a})) = ${value}$。

**检验。** $${mid}$ 出现在 $f$ 的 $x$ 行中，所以它是 $f$ 的合法输入；答案 $${value}$ 是从它下面 $f$ 的输出行中读出的。`,
          ),
        });
      },
    },
    {
      id: "composing-formulas",
      title: t("Composing formulas", "求复合函数的解析式"),
      explanation: t(
        `To find $f(g(x))$ as a formula, do with the expression $g(x)$ exactly what $f$ does with $x$: substitute the whole of $g(x)$, in parentheses, for **every** $x$ in $f(x)$, then expand and collect like terms.

For $f(x) = x^{2} - 1$ and $g(x) = x + 3$:

$$f(g(x)) = (x + 3)^{2} - 1 = x^{2} + 6x + 9 - 1 = x^{2} + 6x + 8.$$

In the other order, $g$ adds $3$ to whatever it is given, so $g(f(x)) = (x^{2} - 1) + 3 = x^{2} + 2$.

> **Watch out.** Keep the parentheses: $(x + 3)^{2}$ is $x^{2} + 6x + 9$, not $x^{2} + 3$ or $x^{2} + 9$. And substitute into the **outer** function: $f(g(x))$ puts $g$ inside $f$, not $f$ inside $g$.`,
        `要求 $f(g(x))$ 的解析式，就对式子 $g(x)$ 做 $f$ 对 $x$ 所做的事：把 $f(x)$ 中的**每个** $x$ 都换成带括号的整个 $g(x)$，再展开、合并同类项。

对于 $f(x) = x^{2} - 1$ 和 $g(x) = x + 3$：

$$f(g(x)) = (x + 3)^{2} - 1 = x^{2} + 6x + 9 - 1 = x^{2} + 6x + 8.$$

反过来的顺序中，$g$ 把给它的任何东西加上 $3$，所以 $g(f(x)) = (x^{2} - 1) + 3 = x^{2} + 2$。

> **注意。** 括号不能丢：$(x + 3)^{2}$ 是 $x^{2} + 6x + 9$，不是 $x^{2} + 3$，也不是 $x^{2} + 9$。另外，要代入**外层**函数：$f(g(x))$ 是把 $g$ 放进 $f$ 里，而不是把 $f$ 放进 $g$ 里。`,
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
        const [i1, o1] = [evalPoly(ii, 1), evalPoly(on, evalPoly(ii, 1))];
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
              `**Step 1: substitute.** The outer function is $${outer}$, so replace every $x$ in $${outer}(x) = ${polyLatex(on)}$ by $(${polyLatex(ii)})$.

**Step 2: expand and collect.**${composeSteps(lhs, on, ii)}

**Check.** At $x = 1$: $${inner}(1) = ${num(i1)}$ and $${outer}(${num(i1)}) = ${num(o1)}$; the formula gives $${num(evalPoly(answer, 1))}$ too.`,
              `**第一步：代入。** 外层函数是 $${outer}$，所以把 $${outer}(x) = ${polyLatex(on)}$ 中的每个 $x$ 都换成 $(${polyLatex(ii)})$。

**第二步：展开并合并。**${composeSteps(lhs, on, ii)}

**检验。** 当 $x = 1$ 时：$${inner}(1) = ${num(i1)}$，$${outer}(${num(i1)}) = ${num(o1)}$；公式在 $x = 1$ 处的值也是 $${num(evalPoly(answer, 1))}$。`,
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
  if (s.kind === "shift") return `${inner}${tail(s.c)}`;
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

/** applyNum applies a step to a number. */
const applyNum = (s: Step, n: number): number => (s.kind === "shift" ? n + s.c : s.kind === "scale" ? n * s.c : n * n);

/** stepOn writes a step applied to a number: "4 - 3", "-2 \cdot 5", "(-1)^{2}". */
function stepOn(s: Step, n: number): string {
  const p = n < 0 ? `(${n})` : `${n}`;
  if (s.kind === "shift") return `${n}${tail(s.c)}`;
  if (s.kind === "scale") return `${s.c} \\cdot ${p}`;
  return `${p}^{2}`;
}

/** stepCheck follows two steps with x = 2 and compares the result with the other order. */
function stepCheck(first: Step, second: Step, right: string): Text {
  const v1 = applyNum(first, 2);
  const v2 = applyNum(second, v1);
  const r1 = applyNum(second, 2);
  const r2 = applyNum(first, r1);
  const [a, b] = [stepText(first), stepText(second)];
  const other =
    r2 === v2
      ? ""
      : ` In the other order, ${b.en} first, $${stepOn(second, 2)} = ${r1}$ and then $${stepOn(first, r1)} = ${r2}$, a different number.`;
  const otherZh =
    r2 === v2 ? "" : `换成另一种顺序，先${b["zh-CN"]}：$${stepOn(second, 2)} = ${r1}$，再 $${stepOn(first, r1)} = ${r2}$，是另一个数。`;
  return t(
    `**Check.** Start with $x = 2$: ${a.en}, $${stepOn(first, 2)} = ${v1}$; then ${b.en}, $${stepOn(second, v1)} = ${v2}$. Putting $x = 2$ into $${right}$ gives $${v2}$ as well.${other}`,
    `**检验。** 从 $x = 2$ 开始：${a["zh-CN"]}，$${stepOn(first, 2)} = ${v1}$；再${b["zh-CN"]}，$${stepOn(second, v1)} = ${v2}$。把 $x = 2$ 代入 $${right}$ 也得到 $${v2}$。${otherZh}`,
  );
}

/** outerWords says in words what each outer function in `outers` does to its input. */
const outerWords: readonly Text[] = [
  t("squares it", "把它平方"),
  t("cubes it", "把它立方"),
  t("takes its square root", "对它开平方"),
  t("takes its reciprocal", "取它的倒数"),
];

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
  intro: t(
    `We can already compute $f(g(x))$ from the formulas of $f$ and $g$. This lesson reads compositions the other way: as a **recipe of steps**, and as a way to break a complicated function into simple pieces.

Take $h(x) = (3x - 2)^{2}$. To compute $h(3)$ by hand you do two things in order: first $3 \\cdot 3 - 2 = 7$, then $7^{2} = 49$. The first step is the function $g(x) = 3x - 2$, the second is $f(x) = x^{2}$, so $h = f \\circ g$:

{{figure 0}}

Seeing a function as steps tells you the order to compute it in, and later it is what lets you undo a function or differentiate it one piece at a time.`,
    `我们已经会由 $f$ 和 $g$ 的公式求 $f(g(x))$。这节课反过来看复合函数：把它看成**一串步骤**，并用它把复杂的函数拆成简单的部分。

看 $h(x) = (3x - 2)^{2}$。手算 $h(3)$ 时要按顺序做两件事：先算 $3 \\cdot 3 - 2 = 7$，再算 $7^{2} = 49$。第一步是函数 $g(x) = 3x - 2$，第二步是 $f(x) = x^{2}$，所以 $h = f \\circ g$：

{{figure 0}}

把函数看成步骤，就知道该按什么顺序计算；以后撤销一个函数、或者一块一块地求导，靠的也是这种看法。`,
  ),
  introFigures: [machineFigure(3, 7, 49)],
  knowledgePoints: [
    {
      id: "compositions-in-words",
      title: t("Compositions in words", "用文字描述复合"),
      explanation: t(
        `A composition is a sequence of steps, done in the order they reach $x$. If $g(x) = x + 3$ (add $3$) and $f(x) = x^{2}$ (square), then in $f(g(x))$ the input meets $g$ first, so

$$f(g(x)) = (x + 3)^{2} \\quad\\text{means: first add } 3\\text{, then square.}$$

With $x = 2$: $2 + 3 = 5$, then $5^{2} = 25$. The parentheses record that the square acts on the whole of $x + 3$.

> **Watch out.** The inner function acts first even though it is written second, on the right. The other order, $g(f(x)) = x^{2} + 3$, squares first and then adds $3$, and gives $7$ at $x = 2$: a different function.`,
        `复合函数就是一串步骤，按它们作用到 $x$ 的先后进行。若 $g(x) = x + 3$（加上 $3$），$f(x) = x^{2}$（平方），则在 $f(g(x))$ 中输入先遇到 $g$，所以

$$f(g(x)) = (x + 3)^{2} \\quad\\text{表示：先加上 } 3\\text{，再平方。}$$

取 $x = 2$：$2 + 3 = 5$，再 $5^{2} = 25$。括号表明平方作用在整个 $x + 3$ 上。

> **注意。** 内层函数虽然写在后面（右边），却先起作用。另一种顺序 $g(f(x)) = x^{2} + 3$ 是先平方再加上 $3$，在 $x = 2$ 处得 $7$，是另一个函数。`,
      ),
      generate(rng) {
        const [k1, k2] = rng.sample(["shift", "scale", "square"] as const, 2);
        const first = drawStep(rng, k1!);
        const second = drawStep(rng, k2!);
        const right = applyStep(second, applyStep(first, "x"));
        const reversed = applyStep(first, applyStep(second, "x"));
        const [a, b] = [stepText(first), stepText(second)];
        const check = stepCheck(first, second, `h(x) = ${right}`);
        if (rng.bool()) {
          const inner = [applyStep(first, "x"), applyStep(second, "x")];
          const options = rng.shuffle([
            right,
            reversed,
            `${inner[0]} ${inner[1]!.startsWith("-") ? `- ${inner[1]!.slice(1)}` : `+ ${inner[1]}`}`,
            `(${inner[0]})(${inner[1]})`,
          ]);
          return choiceProblem({
            prompt: t(
              `To compute $h(x)$, start with $x$, first ${a.en}, then ${b.en}. Which formula is $h(x)$?`,
              `计算 $h(x)$ 时，从 $x$ 开始，先${a["zh-CN"]}，再${b["zh-CN"]}。$h(x)$ 是哪个式子？`,
            ),
            options: options.map((o) => same(`$h(x) = ${o}$`)),
            correct: options.indexOf(right),
            solution: t(
              `**Step 1: the first step.** It acts on $x$ itself: to ${a.en} turns $x$ into $${applyStep(first, "x")}$.

**Step 2: the second step.** It acts on the whole result of the first, so $h(x) = ${right}$.

${check.en}`,
              `**第一步：第一个步骤。** 它作用在 $x$ 本身上：${a["zh-CN"]}，把 $x$ 变成 $${applyStep(first, "x")}$。

**第二步：第二个步骤。** 它作用在第一步的整个结果上，所以 $h(x) = ${right}$。

${check["zh-CN"]}`,
            ),
          });
        }
        const fName = rng.pick(["f", "g"] as const);
        const gName = fName === "f" ? "g" : "f";
        const options = rng.shuffle([0, 1, 2, 3]);
        const words = [
          t(`First ${a.en}, then ${b.en}`, `先${a["zh-CN"]}，再${b["zh-CN"]}`),
          t(`First ${b.en}, then ${a.en}`, `先${b["zh-CN"]}，再${a["zh-CN"]}`),
          t(
            `Do each to $x$ on its own (${a.en}; ${b.en}), then add the results`,
            `对 $x$ 分别操作（${a["zh-CN"]}；${b["zh-CN"]}），再把结果相加`,
          ),
          t(
            `Do each to $x$ on its own (${a.en}; ${b.en}), then multiply the results`,
            `对 $x$ 分别操作（${a["zh-CN"]}；${b["zh-CN"]}），再把结果相乘`,
          ),
        ];
        return choiceProblem({
          prompt: t(
            `Let $${fName}(x) = ${applyStep(second, "x")}$ and $${gName}(x) = ${applyStep(first, "x")}$. Which describes $${fName}(${gName}(x))$?`,
            `设 $${fName}(x) = ${applyStep(second, "x")}$，$${gName}(x) = ${applyStep(first, "x")}$。哪一项描述了 $${fName}(${gName}(x))$？`,
          ),
          options: options.map((i) => words[i]!),
          correct: options.indexOf(0),
          solution: t(
            `**Step 1: the inner function.** In $${fName}(${gName}(x))$ the input $x$ goes into $${gName}$ first, and $${gName}(x) = ${applyStep(first, "x")}$ says: ${a.en}.

**Step 2: the outer function.** Its result goes into $${fName}$, and $${fName}(x) = ${applyStep(second, "x")}$ says: ${b.en}. So $${fName}(${gName}(x)) = ${right}$: first ${a.en}, then ${b.en}.

${check.en.replace(`$h(x) = ${right}$`, `$${fName}(${gName}(x)) = ${right}$`)}`,
            `**第一步：内层函数。** 在 $${fName}(${gName}(x))$ 中，输入 $x$ 先进入 $${gName}$，而 $${gName}(x) = ${applyStep(first, "x")}$ 表示：${a["zh-CN"]}。

**第二步：外层函数。** 它的结果再进入 $${fName}$，而 $${fName}(x) = ${applyStep(second, "x")}$ 表示：${b["zh-CN"]}。所以 $${fName}(${gName}(x)) = ${right}$：先${a["zh-CN"]}，再${b["zh-CN"]}。

${check["zh-CN"].replace(`$h(x) = ${right}$`, `$${fName}(${gName}(x)) = ${right}$`)}`,
          ),
        });
      },
    },
    {
      id: "decomposing-functions",
      title: t("Decomposing a function", "分解函数"),
      explanation: t(
        `To write $h$ as a composition $f(g(x))$, ask how you would compute $h$ by hand: the part computed **first**, straight from $x$, is the inner function $g$, and what is then done to that result is the outer function $f$.

In $h(x) = (2x - 5)^{3}$ you compute $2x - 5$ first and then cube it:

$$g(x) = 2x - 5, \\qquad f(x) = x^{3}.$$

Check by composing: $f(g(x)) = (2x - 5)^{3}$, which is $h(x)$.

> **Watch out.** Keep the whole inside together. Taking $g(x) = 2x$ loses the $-5$, and moving it outside, $f(x) = x^{3} - 5$, subtracts it after cubing. Swapping the two gives $g(f(x)) = 2x^{3} - 5$, which is not $h$ either.`,
        `要把 $h$ 写成复合函数 $f(g(x))$，就想想手算 $h$ 时怎么算：**先**由 $x$ 直接算出的那部分是内层函数 $g$，然后对这个结果所做的事是外层函数 $f$。

在 $h(x) = (2x - 5)^{3}$ 中，先算 $2x - 5$，再立方：

$$g(x) = 2x - 5, \\qquad f(x) = x^{3}.$$

复合检验：$f(g(x)) = (2x - 5)^{3}$，正是 $h(x)$。

> **注意。** 里面的部分要整体保留。取 $g(x) = 2x$ 会丢掉 $-5$；把它移到外面，$f(x) = x^{3} - 5$，又变成立方之后才减。把两者交换得 $g(f(x)) = 2x^{3} - 5$，也不是 $h$。`,
      ),
      generate(rng) {
        const a = rng.sign() * rng.int(2, 6);
        const b = rng.nonZero(-9, 9);
        const L = linear(a, b);
        const outer = rng.pick(outers);
        const does = outerWords[outers.indexOf(outer)]!;
        const swapped = `${outer.f === "\\frac{1}{x}" ? (a < 0 ? `-\\frac{${-a}}{x}` : `\\frac{${a}}{x}`) : `${a}${outer.f}`}${tail(b)}`;
        const h = outer.of(L);
        const candidates = [
          `f(x) = ${outer.f}, \\; g(x) = ${L}`,
          `f(x) = ${L}, \\; g(x) = ${outer.f}`,
          `f(x) = ${outer.f}${tail(b)}, \\; g(x) = ${a}x`,
          `f(x) = ${outer.f}, \\; g(x) = ${a}x`,
        ];
        const options = rng.shuffle(candidates);
        return reasoned(
          choiceProblem({
            prompt: t(`Which choice of $f$ and $g$ gives $f(g(x)) = ${h}$?`, `哪一组 $f$ 和 $g$ 满足 $f(g(x)) = ${h}$？`),
            options: options.map((o) => same(`$${o}$`)),
            correct: options.indexOf(candidates[0]!),
            solution: t(
              `**Step 1: the inner function.** To compute $${h}$ you first work out $${L}$ from $x$, so the inner function is $g(x) = ${L}$.

**Step 2: the outer function.** The last step ${does.en}. Writing $x$ for the inside gives $f(x) = ${outer.f}$.

**Check.** $f(g(x)) = ${outer.of(`g(x)`)} = ${h}$, as required. The other way round, $g(f(x)) = ${swapped}$, is a different function.`,
              `**第一步：内层函数。** 计算 $${h}$ 时，先由 $x$ 算出 $${L}$，所以内层函数是 $g(x) = ${L}$。

**第二步：外层函数。** 最后一步${does["zh-CN"]}。把里面的部分写成 $x$，得 $f(x) = ${outer.f}$。

**检验。** $f(g(x)) = ${outer.of(`g(x)`)} = ${h}$，符合要求。反过来 $g(f(x)) = ${swapped}$ 是另一个函数。`,
            ),
          }),
          [
            [
              `$${candidates[1]!}$`,
              `The two functions are exchanged: $${L}$ is computed first, so it is the inner function $g$.`,
              `两个函数弄反了：先算 $${L}$，所以它是内层函数 $g$。`,
            ],
            [
              `$${candidates[2]!}$`,
              `This ${b > 0 ? `adds $${b}$` : `subtracts $${-b}$`} after the outer function acts, but that term belongs inside it.`,
              `这是在外层函数作用之后才${b > 0 ? `加上 $${b}$` : `减去 $${-b}$`}，但这一项应该在里面。`,
            ],
            [`$${candidates[3]!}$`, `The $${b}$ has been lost: the inner function must be $${L}$.`, `$${b}$ 丢了：内层函数应该是 $${L}$。`],
          ],
        );
      },
    },
    {
      id: "finding-the-inner-or-outer-function",
      title: t("Finding the inner or outer function", "求内层或外层函数"),
      explanation: t(
        `If $h(x) = f(g(x))$ and one of the two functions is known, the other can be read off, because $h$ does to the block $g(x)$ exactly what $f$ does to $x$.

**The outer function.** With $g(x) = 3x + 1$ and $h(x) = 2(3x + 1)^{2} - 7$, the block $3x + 1$ is squared, doubled and lowered by $7$. Doing that to $x$ instead gives $f(x) = 2x^{2} - 7$.

**The inner function.** With $f(x) = 4x + 1$ and $f(g(x)) = 8x - 11$, write $4g(x) + 1 = 8x - 11$ and solve for the block: $4g(x) = 8x - 12$, so $g(x) = 2x - 3$.

> **Watch out.** Keep $f$ and $h$ apart: $f(x)$ has $x$ where $h$ has the block, so $f(x) = 2x^{2} - 7$, not $2(3x + 1)^{2} - 7$, and dropping the $-7$ loses part of $f$.`,
        `若 $h(x) = f(g(x))$，并且已知两个函数中的一个，就可以读出另一个，因为 $h$ 对整块 $g(x)$ 所做的，正是 $f$ 对 $x$ 所做的。

**求外层函数。** 若 $g(x) = 3x + 1$，$h(x) = 2(3x + 1)^{2} - 7$，则整块 $3x + 1$ 被平方、乘以 $2$、再减去 $7$。改为对 $x$ 做同样的事，得 $f(x) = 2x^{2} - 7$。

**求内层函数。** 若 $f(x) = 4x + 1$，$f(g(x)) = 8x - 11$，写出 $4g(x) + 1 = 8x - 11$，把整块解出来：$4g(x) = 8x - 12$，所以 $g(x) = 2x - 3$。

> **注意。** 分清 $f$ 和 $h$：$h$ 中是整块的地方，$f$ 中是 $x$，所以 $f(x) = 2x^{2} - 7$，而不是 $2(3x + 1)^{2} - 7$；丢掉 $-7$ 也会丢掉 $f$ 的一部分。`,
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
          const h = `${coef}(${L})^{${n}}${tail(d)}`;
          const answer = poly([c, `x^{${n}}`], [d, ""]);
          return withPrefix(
            expressionProblem({
              prompt: t(`Given $g(x) = ${L}$ and $f(g(x)) = ${h}$, find $f(x)$.`, `已知 $g(x) = ${L}$，$f(g(x)) = ${h}$，求 $f(x)$。`),
              answer,
              wrong: [h, `x^{${n}}`, poly([c, `x^{${n}}`]), poly([c, `x^{${n}}`], [d - b, ""])],
              solution: t(
                `**Step 1: find the block.** In $f(g(x)) = ${h}$, the expression $g(x) = ${L}$ appears as one block, $(${L})$.

**Step 2: put $x$ in its place.** $f$ does to $x$ what $f(g(x))$ does to the block, so replace $(${L})$ by $x$: $f(x) = ${answer}$.

**Check.** Putting $g(x)$ into this $f$: $f(g(x)) = ${coef}(g(x))^{${n}}${tail(d)} = ${h}$, as given.`,
                `**第一步：找出整块。** 在 $f(g(x)) = ${h}$ 中，式子 $g(x) = ${L}$ 作为一整块 $(${L})$ 出现。

**第二步：用 $x$ 代替它。** $f$ 对 $x$ 所做的就是 $f(g(x))$ 对这一块所做的，所以把 $(${L})$ 换成 $x$：$f(x) = ${answer}$。

**检验。** 把 $g(x)$ 代入这个 $f$：$f(g(x)) = ${coef}(g(x))^{${n}}${tail(d)} = ${h}$，与已知相同。`,
              ),
            }),
            "f(x) =",
          );
        }
        const k = rng.sign() * rng.int(2, 5);
        const cube = rng.bool();
        const fLatex = cube ? `x^{3}${tail(d)}` : linear(k, d);
        const h = cube ? `(${L})^{3}${tail(d)}` : linear(k * a, k * b + d);
        const undo = d > 0 ? t(`Subtract $${d}$ from`, `两边同时减去 $${d}$`) : t(`Add $${-d}$ to`, `两边同时加上 $${-d}$`);
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
                  `**Step 1: what $f$ does.** $f(x) = ${fLatex}$ cubes its input and then ${d > 0 ? `adds $${d}$` : `subtracts $${-d}$`}, so $f(g(x)) = (g(x))^{3}${tail(d)}$.

**Step 2: match the block.** In $f(g(x)) = ${h}$ the cube acts on $${L}$, and the same constant term follows it. So $g(x) = ${L}$.

**Check.** $f(${L}) = (${L})^{3}${tail(d)}$, which is the given $f(g(x))$.`,
                  `**第一步：$f$ 做了什么。** $f(x) = ${fLatex}$ 先把输入立方，再${d > 0 ? `加上 $${d}$` : `减去 $${-d}$`}，所以 $f(g(x)) = (g(x))^{3}${tail(d)}$。

**第二步：对上整块。** 在 $f(g(x)) = ${h}$ 中，立方作用在 $${L}$ 上，后面跟着同样的常数项。所以 $g(x) = ${L}$。

**检验。** $f(${L}) = (${L})^{3}${tail(d)}$，正是已知的 $f(g(x))$。`,
                )
              : t(
                  `**Step 1: write $f(g(x))$ with $f$.** $f$ multiplies its input by $${k}$ and then ${d > 0 ? `adds $${d}$` : `subtracts $${-d}$`}, so$$${k}g(x)${tail(d)} = ${h}.$$

**Step 2: solve for $g(x)$.** ${undo.en} both sides, then divide by $${k}$:${steps(`${k}g(x) = ${linear(k * a, k * b)}`, `g(x) = ${L}`)}

**Check.**${steps(`f(${L}) = ${k}(${L})${tail(d)}`, `= ${linear(k * a, k * b)}${tail(d)}`, `= ${h}`)}`,
                  `**第一步：用 $f$ 写出 $f(g(x))$。** $f$ 把输入乘以 $${k}$，再${d > 0 ? `加上 $${d}$` : `减去 $${-d}$`}，所以$$${k}g(x)${tail(d)} = ${h}.$$

**第二步：解出 $g(x)$。** ${undo["zh-CN"]}，再除以 $${k}$：${steps(`${k}g(x) = ${linear(k * a, k * b)}`, `g(x) = ${L}`)}

**检验。**${steps(`f(${L}) = ${k}(${L})${tail(d)}`, `= ${linear(k * a, k * b)}${tail(d)}`, `= ${h}`)}`,
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
  encompasses: [],
  xp: 16,
  standards: ["CCSS.HSF.BF.B.4.A"],
  intro: t(
    `A function takes an input to an output, and composing functions runs them one after the other. Often the question goes the other way: we know the **output** and want the input that produced it.

A shop charges $f(x) = 3x + 2$ dollars for $x$ kilograms of fruit: $3$ dollars a kilogram plus $2$ for the bag. If a bill says $14$ dollars, how much fruit was bought? Undo the steps in reverse order: take away the $2$, giving $12$, then divide by $3$, giving $4$ kilograms. The rule that does this for any bill, $x \\mapsto \\frac{x - 2}{3}$, is the **inverse function** of $f$.

In this lesson we read inverses from tables, find the inverses of linear functions, and check by composing that two functions undo each other.`,
    `函数把输入对应到输出，复合函数把几个函数一个接一个地作用。但很多时候问题是反过来的：知道**输出**，想求出产生它的输入。

一家店卖 $x$ 千克水果收 $f(x) = 3x + 2$ 元：每千克 $3$ 元，另加 $2$ 元袋子费。如果账单是 $14$ 元，买了多少水果？按相反的顺序撤销各步：先去掉 $2$，得 $12$；再除以 $3$，得 $4$ 千克。对任何账单都这样做的规则 $x \\mapsto \\frac{x - 2}{3}$，就是 $f$ 的**反函数**。

这节课从数值表读出反函数值，求一次函数的反函数，并用复合检验两个函数是否互相撤销。`,
  ),
  knowledgePoints: [
    {
      id: "inverse-values-from-a-table",
      title: t("Inverse values from a table", "从数值表读反函数值"),
      explanation: t(
        `The **inverse** $f^{-1}$ of a function $f$ undoes it: if $f(a) = b$, then $f^{-1}(b) = a$. It runs the table backwards, swapping inputs and outputs.

So to find $f^{-1}(b)$ from a table of $f$, look for $b$ among the **outputs**, in the $f(x)$ row, and read the input above it. If $f(2) = 7$, then $f^{-1}(7) = 2$, because $2$ is the input that $f$ sends to $7$.

> **Watch out.** Do not look $b$ up as an input: $f^{-1}(7)$ is not $f(7)$. And the $-1$ is not an exponent: $f^{-1}(7)$ is **not** $\\frac{1}{f(7)}$ or $\\frac{1}{7}$.`,
        `函数 $f$ 的**反函数** $f^{-1}$ 撤销 $f$ 的作用：若 $f(a) = b$，则 $f^{-1}(b) = a$。它把数值表倒过来读，把输入和输出对调。

所以从 $f$ 的数值表求 $f^{-1}(b)$，要在**输出**中，也就是 $f(x)$ 行里找 $b$，再读出它上面的输入。若 $f(2) = 7$，则 $f^{-1}(7) = 2$，因为 $2$ 是被 $f$ 对应到 $7$ 的输入。

> **注意。** 不要把 $b$ 当作输入去查：$f^{-1}(7)$ 不是 $f(7)$。另外，这里的 $-1$ 不是指数：$f^{-1}(7)$ **不是** $\\frac{1}{f(7)}$，也不是 $\\frac{1}{7}$。`,
      ),
      generate(rng) {
        const xs = rng.sample(range(-5, 8), 5).sort((a, b) => a - b);
        const ys = rng.sample(range(-9, 12), 5);
        const i = rng.int(0, 4);
        const b = ys[i]!;
        const a = xs[i]!;
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
          answer: a,
          wrong,
          solution: t(
            `**Step 1: what is asked.** $f^{-1}(${b})$ is the input that $f$ sends to $${b}$, so look for $${b}$ among the outputs, in the $f(x)$ row.

**Step 2: read the input.** $${b}$ is in the column of $x = ${a}$: $${valueLatex("f", a, b)}$. So $f^{-1}(${b}) = ${a}$.

**Check.** $${b}$ appears only once in the $f(x)$ row, so no other input is sent to it, and the answer $${a}$ is an input of $f$, from the $x$ row.${fb === undefined ? "" : ` Reading $${b}$ as an input instead would give $f(${b}) = ${fb}$, which answers a different question.`}`,
            `**第一步：题目问什么。** $f^{-1}(${b})$ 是被 $f$ 对应到 $${b}$ 的输入，所以要在输出中，也就是 $f(x)$ 行里找 $${b}$。

**第二步：读出输入。** $${b}$ 在 $x = ${a}$ 那一列：$${valueLatex("f", a, b)}$。所以 $f^{-1}(${b}) = ${a}$。

**检验。** $${b}$ 在 $f(x)$ 行中只出现一次，所以没有别的输入对应到它；答案 $${a}$ 是 $f$ 的输入，来自 $x$ 行。${fb === undefined ? "" : `如果把 $${b}$ 当作输入，会得到 $f(${b}) = ${fb}$，那回答的是另一个问题。`}`,
          ),
        });
      },
    },
    {
      id: "inverses-of-linear-functions",
      title: t("Inverses of linear functions", "一次函数的反函数"),
      explanation: t(
        `$f(x) = 2x + 3$ does two things: multiply by $2$, then add $3$. To undo it, do the opposite steps **in reverse order**, as when taking off shoes and socks: subtract $3$, then divide by $2$:

$$f^{-1}(x) = \\frac{x - 3}{2}.$$

The same result comes from algebra: write $y = 2x + 3$, swap $x$ and $y$ to swap inputs and outputs, and solve $x = 2y + 3$ for $y$: $x - 3 = 2y$, so $y = \\frac{x - 3}{2}$. For instance $f(4) = 11$ and $f^{-1}(11) = \\frac{11 - 3}{2} = 4$.

> **Watch out.** Undoing in the original order gives $\\frac{x}{2} - 3$, which sends $11$ to $2.5$, not $4$. And the inverse is not the reciprocal: $f^{-1}(x)$ is not $\\frac{1}{2x + 3}$.`,
        `$f(x) = 2x + 3$ 做了两件事：先乘以 $2$，再加上 $3$。要撤销它，就**按相反的顺序**做相反的运算，就像先脱鞋再脱袜子：先减去 $3$，再除以 $2$：

$$f^{-1}(x) = \\frac{x - 3}{2}.$$

用代数也得到同样的结果：写成 $y = 2x + 3$，交换 $x$ 与 $y$（也就是交换输入与输出），再从 $x = 2y + 3$ 中解出 $y$：$x - 3 = 2y$，所以 $y = \\frac{x - 3}{2}$。例如 $f(4) = 11$，而 $f^{-1}(11) = \\frac{11 - 3}{2} = 4$。

> **注意。** 按原来的顺序撤销会得到 $\\frac{x}{2} - 3$，它把 $11$ 变成 $2.5$，而不是 $4$。另外，反函数不是倒数：$f^{-1}(x)$ 不是 $\\frac{1}{2x + 3}$。`,
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
        const ay = a === 1 ? "y" : a === -1 ? "-y" : `${a}y`;
        const af = a === 1 ? "" : a === -1 ? "-" : `${a}`;
        const undo = b > 0 ? t(`subtract $${b}$ from`, `减去 $${b}$`) : t(`add $${-b}$ to`, `加上 $${-b}$`);
        const solve = a === 1 ? steps(`${linear(1, -b)} = y`) : steps(`${linear(1, -b)} = ${ay}`, `y = ${answer}`);
        const divide = a === 1 ? t("", "") : t(`, then divide both sides by $${a}$`, `，再两边同时除以 $${a}$`);
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
            ].filter((w) => w !== canonical),
            solution: t(
              `**Step 1: swap inputs and outputs.** Write $y = ${linear(a, b)}$ and swap $x$ and $y$: $x = ${ay}${tail(b)}$.

**Step 2: solve for $y$.** This undoes $f$ in reverse order: ${undo.en} both sides${divide.en}:${solve}

So $f^{-1}(x) = ${answer}$.

**Check.** Composing should give back $x$:${steps(`f(f^{-1}(x)) = ${af}\\left(${answer}\\right)${tail(b)}`, `= ${linear(1, -b)}${tail(b)}`, "= x")}`,
              `**第一步：交换输入与输出。** 写成 $y = ${linear(a, b)}$，再交换 $x$ 与 $y$：$x = ${ay}${tail(b)}$。

**第二步：解出 $y$。** 这就是按相反顺序撤销 $f$：两边同时${undo["zh-CN"]}${divide["zh-CN"]}：${solve}

所以 $f^{-1}(x) = ${answer}$。

**检验。** 复合后应当回到 $x$：${steps(`f(f^{-1}(x)) = ${af}\\left(${answer}\\right)${tail(b)}`, `= ${linear(1, -b)}${tail(b)}`, "= x")}`,
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
        `Two functions $f$ and $g$ are inverses exactly when each undoes the other: $f(g(x)) = x$ and $g(f(x)) = x$ for every $x$. So compose them and simplify; for linear functions checking one order is enough.

For $f(x) = 3x - 6$ and $g(x) = \\frac{1}{3}x + 2$:

$$f(g(x)) = 3\\left(\\frac{1}{3}x + 2\\right) - 6 = x + 6 - 6 = x,$$

so they are inverses. For $h(x) = \\frac{1}{3}x - 6$ instead, $f(h(x)) = x - 18 - 6 = x - 24$, which is not $x$.

> **Watch out.** The composition must be exactly $x$. A result such as $x - 24$ or $-x$ means the functions do not undo each other, even if the slopes look like reciprocals.`,
        `两个函数 $f$ 和 $g$ 互为反函数，当且仅当它们互相撤销：对每个 $x$ 都有 $f(g(x)) = x$ 且 $g(f(x)) = x$。所以把它们复合并化简；对于一次函数，只需检验一种顺序。

对于 $f(x) = 3x - 6$ 和 $g(x) = \\frac{1}{3}x + 2$：

$$f(g(x)) = 3\\left(\\frac{1}{3}x + 2\\right) - 6 = x + 6 - 6 = x,$$

所以它们互为反函数。若换成 $h(x) = \\frac{1}{3}x - 6$，则 $f(h(x)) = x - 18 - 6 = x - 24$，它不是 $x$。

> **注意。** 复合的结果必须恰好是 $x$。像 $x - 24$ 或 $-x$ 这样的结果说明两个函数并不互相撤销，即使它们的斜率看起来互为倒数。`,
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
        const distributed = `${poly([cx, "x"], [Q.of(a).mul(v), ""])}${tail(b)}`;
        const x0 = !inverse && cx.add(c0).eq(Q.one) ? 0 : 1;
        const g1 = u.mul(Q.of(x0)).add(v);
        const f1 = Q.of(a).mul(g1).add(Q.of(b));
        const g1Text = g1.sign() < 0 ? `\\left(${num(g1)}\\right)` : num(g1);
        return choiceProblem({
          prompt: t(
            `Are $f(x) = ${linear(a, b)}$ and $g(x) = ${g}$ inverse functions?`,
            `$f(x) = ${linear(a, b)}$ 与 $g(x) = ${g}$ 互为反函数吗？`,
          ),
          options: yesNo,
          correct: inverse ? 0 : 1,
          solution: t(
            `**Step 1: compose.** Put $g(x)$ in for $x$ in $f$:$$f(g(x)) = ${a}\\left(${g}\\right)${tail(b)}.$$

**Step 2: simplify.**${steps(`f(g(x)) = ${distributed}`, `= ${composed}`)}${inverse ? "This is exactly $x$, so $f$ and $g$ undo each other: **yes**, they are inverses." : `This is not $x$, so $g$ does not undo $f$: **no**, they are not inverses.`}

**Check.** Try $x = ${x0}$: $g(${x0}) = ${num(g1)}$ and $f(${num(g1)}) = ${a} \\cdot ${g1Text}${tail(b)} = ${num(f1)}$, ${f1.eq(Q.of(x0)) ? `which is $${x0}$ again, as an inverse requires` : `not $${x0}$, so $f$ does not bring $${x0}$ back`}.`,
            `**第一步：复合。** 把 $g(x)$ 代入 $f$ 中的 $x$：$$f(g(x)) = ${a}\\left(${g}\\right)${tail(b)}.$$

**第二步：化简。**${steps(`f(g(x)) = ${distributed}`, `= ${composed}`)}${inverse ? "结果恰好是 $x$，所以 $f$ 与 $g$ 互相撤销：**是**，它们互为反函数。" : "结果不是 $x$，所以 $g$ 没有撤销 $f$：**不是**，它们不互为反函数。"}

**检验。** 取 $x = ${x0}$：$g(${x0}) = ${num(g1)}$，$f(${num(g1)}) = ${a} \\cdot ${g1Text}${tail(b)} = ${num(f1)}$，${f1.eq(Q.of(x0)) ? `又回到了 $${x0}$，正符合反函数的要求` : `不是 $${x0}$，所以 $f$ 没有把 $${x0}$ 送回来`}。`,
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
