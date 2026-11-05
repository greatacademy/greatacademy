// More knowledge points that ask a learner to read a drawing, for the courses whose
// questions are mostly symbols. See `moreFigureReadingPoints`.

import type { Figure, KnowledgePointDef, Problem, Rng, Text } from "@ga/content";
import { t } from "@ga/content";
import type { PlaneMark, PlaneView, Point } from "@ga/subject-math";
import { gcd, plane, Q, svgDocument } from "@ga/subject-math";

import { numberProblem } from "../problems.ts";
import { pickChoice as choiceFrom } from "./grade-4-fractions.ts";

/** math writes the same formula as an option in both languages. */
const math = (latex: string): Text => t(`$${latex}$`, `$${latex}$`);

/** pickChoice builds a choice problem with its figure, after dropping wrong options that repeat the right one or each other. */
export function pickChoice(rng: Rng, prompt: Text, correct: Text, wrong: readonly Text[], solution: Text, figure: Figure): Problem {
  const seen = new Set([correct.en]);
  return choiceFrom(
    rng,
    prompt,
    correct,
    wrong.filter((w) => !seen.has(w.en) && Boolean(seen.add(w.en))),
    solution,
    figure,
  );
}

/** numeric builds a number problem with its figure. */
export function numeric(
  prompt: Text,
  answer: number | Q,
  wrong: readonly (number | Q)[],
  solution: Text,
  figure: Figure,
  form: "number" | "integer" | "fraction" | "decimal" = "number",
): Problem {
  return { ...numberProblem({ prompt, answer, form, wrong: [...wrong], solution }), figure };
}

/** square is the view from -r to r on both axes. */
const square = (r: number): PlaneView => ({ xMin: -r, xMax: r, yMin: -r, yMax: r, labelEvery: r > 6 ? 2 : 1 });

/** drawn wraps marks in a figure. */
export const drawn = (view: PlaneView, marks: readonly PlaneMark[], alt: Text): Figure => ({ svg: plane(view, marks), alt });

/** parametric samples a curve as a chain of points. */
function parametric(r: (s: number) => Point, from: number, to: number, n = 120): Point[] {
  return Array.from({ length: n + 1 }, (_, i) => r(from + ((to - from) * i) / n));
}

/** label draws a piece of text in an SVG figure. */
export const label = (x: number, y: number, text: string, extra = "") =>
  `<text x="${x}" y="${y}" stroke="none" fill="currentColor" ${extra}>${text}</text>`;

/** arrowLine draws an arrow between two points, stopping short of the ends so that it clears the nodes. */
export function arrowLine([x1, y1]: Point, [x2, y2]: Point, gap = 14, accent = false): string {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const [ux, uy] = [(x2 - x1) / length, (y2 - y1) / length];
  const [ax, ay] = [x1 + ux * gap, y1 + uy * gap];
  const [bx, by] = [x2 - ux * gap, y2 - uy * gap];
  const r = (v: number) => Math.round(v * 10) / 10;
  const head = `${r(bx)},${r(by)} ${r(bx - ux * 8 - uy * 4)},${r(by - uy * 8 + ux * 4)} ${r(bx - ux * 8 + uy * 4)},${r(by - uy * 8 - ux * 4)}`;
  const cls = accent ? ' class="accent"' : "";
  return `<line${cls} x1="${r(ax)}" y1="${r(ay)}" x2="${r(bx)}" y2="${r(by)}"/><polygon${cls} points="${head}" fill="currentColor" stroke="none"/>`;
}

/** ring places n points evenly on a circle, the first at the top, running clockwise. */
export function ring(n: number, r: number, cx = 160, cy = 110): Point[] {
  return Array.from({ length: n }, (_, i): Point => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return [Math.round((cx + r * Math.cos(a)) * 10) / 10, Math.round((cy + r * Math.sin(a)) * 10) / 10];
  });
}

/** node draws a labelled circle. */
export const node = ([x, y]: Point, text: string) => `<circle cx="${x}" cy="${y}" r="12"/>${label(x, y + 4, text)}`;

/** graphFigure draws a graph on labelled vertices in a ring, with arrows when directed. */
function graphFigure(names: readonly string[], edges: readonly (readonly [number, number])[], directed: boolean, alt: Text): Figure {
  const at = ring(names.length, 85);
  const lines = edges.map(([a, b]) => {
    const [p, q] = [at[a] as Point, at[b] as Point];
    if (directed && a === b) return `<circle cx="${p[0]}" cy="${p[1] - 18}" r="8"/>`;
    return directed ? arrowLine(p, q) : `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`;
  });
  return { svg: svgDocument(220, lines.join("") + names.map((name, i) => node(at[i] as Point, name)).join("")), alt };
}

/** mapFigure draws a function between two columns of labelled dots, with an arrow from each element of the first. */
function mapFigure(left: readonly string[], right: readonly string[], arrows: readonly number[], alt: Text): Figure {
  const y = (i: number, n: number) => 110 + (i - (n - 1) / 2) * 42;
  const parts = [
    ...left.map((name, i) => node([70, y(i, left.length)], name)),
    ...right.map((name, i) => node([250, y(i, right.length)], name)),
    ...arrows.map((j, i) => arrowLine([70, y(i, left.length)], [250, y(j, right.length)])),
  ];
  return { svg: svgDocument(220, parts.join("")), alt };
}

/** tableFigure draws a labelled square table such as a Cayley table. */
function tableFigure(heads: readonly string[], cells: readonly (readonly string[])[], alt: Text): Figure {
  const n = heads.length;
  const size = 30;
  const left = 160 - ((n + 1) * size) / 2;
  const parts: string[] = [];
  for (let i = 0; i <= n + 1; i++) {
    const weight = i === 1 ? ' stroke-width="2"' : ' stroke-width="0.8"';
    parts.push(`<line x1="${left + i * size}" y1="6" x2="${left + i * size}" y2="${6 + (n + 1) * size}"${weight}/>`);
    parts.push(`<line x1="${left}" y1="${6 + i * size}" x2="${left + (n + 1) * size}" y2="${6 + i * size}"${weight}/>`);
  }
  heads.forEach((h, i) => {
    parts.push(label(left + (i + 1.5) * size, 6 + 0.5 * size + 4, h));
    parts.push(label(left + 0.5 * size, 6 + (i + 1.5) * size + 4, h));
  });
  cells.forEach((row, i) => {
    row.forEach((c, j) => {
      parts.push(label(left + (j + 1.5) * size, 6 + (i + 1.5) * size + 4, c));
    });
  });
  return { svg: svgDocument(12 + (n + 1) * size, parts.join("")), alt };
}

// ---------------------------------------------------------------------------
// Calculus II
// ---------------------------------------------------------------------------

const areaSetupFromDrawing: KnowledgePointDef = {
  id: "the-area-integral-from-a-drawing",
  title: t("The area integral from a drawing", "由图写面积积分"),
  explanation: t(
    "A drawing settles what the formula leaves open: which curve lies on top, and where the curves meet. The area between them is the integral of top minus bottom, between the two crossings. Writing bottom minus top gives a negative number, and reading the limits from the wrong axis gives the wrong region altogether, so check both against the picture.",
    "图能确定公式留下的问题：哪条曲线在上面，两条曲线在哪里相交。它们之间的面积是上减下的积分，积分限是两个交点。写成下减上会得到负数，从错误的轴读积分限则会得到完全不同的区域，所以两者都要和图对照。",
  ),
  generate(rng) {
    const k = rng.int(1, 3);
    const low = rng.int(0, 4);
    const high = low + k * k;
    const up = rng.bool();
    const curve = up ? (low === 0 ? "x^2" : `x^2 + ${low}`) : `-x^2 + ${high}`;
    const level = up ? high : low;
    const f = (x: number) => (up ? x * x + low : high - x * x);
    const [top, bottom] = up ? [`${level}`, curve] : [curve, `${level}`];
    const diff = (a: string, b: string) => {
      if (b === "0") return a;
      if (a === "0") return `-(${b})`;
      return b.includes(" ") ? `${a} - (${b})` : `${a} - ${b}`;
    };
    const integral = (from: string, body: string) => `\\int_{${from}}^{${k}} \\left(${body}\\right) \\, dx`;
    return pickChoice(
      rng,
      t(
        `The shaded region lies between $y = ${curve}$ and $y = ${level}$. Which integral gives its area?`,
        `阴影区域在 $y = ${curve}$ 和 $y = ${level}$ 之间。哪个积分给出它的面积？`,
      ),
      math(integral(`-${k}`, diff(top, bottom))),
      [
        math(integral(`-${k}`, diff(bottom, top))),
        math(integral("0", diff(top, bottom))),
        math(integral(`-${k}`, curve)),
        math(integral("0", diff(bottom, top))),
      ],
      t(
        `${up ? "The line" : "The parabola"} is on top here, and the curves meet at $x = \\pm ${k}$. So the integrand is top minus bottom, between those limits.`,
        `这里${up ? "直线" : "抛物线"}在上面，两条曲线相交于 $x = \\pm ${k}$。所以被积函数是上减下，积分限就是这两个值。`,
      ),
      drawn(
        { xMin: -k - 2, xMax: k + 2, yMin: -1, yMax: high + 2, labelEvery: high > 8 ? 2 : 1 },
        [
          { kind: "polygon", points: parametric((x) => [x, f(x)], -k, k, 40) },
          { kind: "curve", f, accent: true },
          { kind: "line", a: [0, level], b: [1, level], accent: true },
        ],
        t(
          `The parabola y = ${curve} and the line y = ${level}, with the region between them shaded from x = -${k} to x = ${k}.`,
          `抛物线 y = ${curve} 和直线 y = ${level}，它们之间从 x = -${k} 到 x = ${k} 的区域涂了阴影。`,
        ),
      ),
    );
  },
};

const washerFromDrawing: KnowledgePointDef = {
  id: "the-outer-and-inner-radius-from-a-drawing",
  title: t("The outer and inner radius from a drawing", "由图读外半径和内半径"),
  explanation: t(
    "To turn a region about the $x$-axis, picture a thin slice at a value of $x$. It sweeps out a washer, whose outer radius reaches the curve further from the axis and whose inner radius reaches the nearer one. The volume adds up $\\pi$ times outer squared minus inner squared. Squaring the difference of the radii is the classic error, since it is a different number.",
    "把区域绕 $x$ 轴旋转时，想象在某个 $x$ 处的一条细薄切片。它扫出一个垫圈，外半径到离轴较远的曲线，内半径到较近的曲线。体积把 $\\pi$ 乘外半径平方减内半径平方累加起来。把两半径之差平方是典型的错误，那是另一个数。",
  ),
  generate(rng) {
    const linear = (a: number) => (a === 1 ? "x" : `${a}x`);
    const square2 = (b: number) => (b === 1 ? "x^2" : `${b}x^2`);
    const variants = [
      ...[
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1],
        [2, 2],
        [4, 2],
        [6, 2],
        [3, 3],
        [6, 3],
      ].map(([a = 1, b = 1]) => ({
        outer: linear(a),
        inner: square2(b),
        end: a / b,
        high: (x: number) => a * x,
        low: (x: number) => b * x * x,
      })),
      ...[1, 2, 3, 4].map((k) => ({ outer: `${k * k}`, inner: "x^2", end: k, high: () => k * k, low: (x: number) => x * x })),
      ...[
        [2, 1],
        [3, 1],
        [4, 1],
        [5, 1],
        [6, 1],
        [2, 2],
        [4, 2],
        [6, 2],
        [8, 2],
        [3, 3],
        [6, 3],
        [4, 4],
        [8, 4],
      ].map(([m = 1, a = 1]) => ({
        outer: `${m}`,
        inner: linear(a),
        end: m / a,
        high: () => m,
        low: (x: number) => a * x,
      })),
    ];
    const { outer, inner, end, high, low } = rng.pick(variants);
    const top = high(end);
    const squared = (v: string) => (v.includes("x") ? `(${v})^2` : `${v}^2`);
    const volume = (body: string) => `\\pi \\int_0^{${end}} ${body} \\, dx`;
    return pickChoice(
      rng,
      t(
        `The shaded region between $y = ${outer}$ and $y = ${inner}$ turns about the x-axis. Which integral gives the volume?`,
        `$y = ${outer}$ 和 $y = ${inner}$ 之间的阴影区域绕 x 轴旋转。哪个积分给出体积？`,
      ),
      math(volume(`\\left(${squared(outer)} - ${squared(inner)}\\right)`)),
      [
        math(volume(`\\left(${outer} - ${inner}\\right)^2`)),
        math(volume(`\\left(${squared(inner)} - ${squared(outer)}\\right)`)),
        math(volume(`\\left(${outer} - ${inner}\\right)`)),
        math(volume(squared(outer))),
      ],
      t(
        `The curve $y = ${outer}$ is further from the axis, so it gives the outer radius, and $y = ${inner}$ gives the inner radius. A washer has area $\\pi$ times outer squared minus inner squared.`,
        `曲线 $y = ${outer}$ 离轴较远，所以给出外半径，$y = ${inner}$ 给出内半径。垫圈的面积是 $\\pi$ 乘外半径平方减内半径平方。`,
      ),
      drawn(
        { xMin: -1, xMax: end + 1, yMin: -1, yMax: top + 1, labelEvery: top > 8 ? 2 : 1 },
        [
          { kind: "polygon", points: [...parametric((x) => [x, low(x)], 0, end, 40), ...parametric((x) => [x, high(x)], end, 0, 40)] },
          { kind: "curve", f: low, accent: true },
          { kind: "curve", f: high, accent: true },
        ],
        t(
          `The curve y = ${outer} above the curve y = ${inner} from x = 0 to x = ${end}, with the region between them shaded.`,
          `从 x = 0 到 x = ${end}，曲线 y = ${outer} 在曲线 y = ${inner} 上方，它们之间的区域涂了阴影。`,
        ),
      ),
    );
  },
};

const taylorFromDrawing: KnowledgePointDef = {
  id: "a-taylor-polynomial-from-a-drawing",
  title: t("A Taylor polynomial from a drawing", "由图选泰勒多项式"),
  explanation: t(
    "The first coefficients of a Taylor polynomial can be read off a graph at the center. The constant is the height, the coefficient of the linear term is the slope, and the coefficient of the square term has the sign of the concavity. So a curve that is rising and bending downward has a positive linear coefficient and a negative square coefficient.",
    "泰勒多项式的前几个系数可以从图上中心点处读出。常数项是高度，一次项系数是斜率，二次项系数的符号和凹凸性相同。所以上升且向下弯的曲线，一次项系数为正，二次项系数为负。",
  ),
  generate(rng) {
    const h = rng.pick([-3, -2, -1, 1, 2, 3]);
    const m = rng.pick([1, 2, -1, -2]);
    const c = rng.pick([1, -1]);
    const write = (hv: number, mv: number, cv: number) => {
      const lin = mv === 1 ? "+ x" : mv === -1 ? "- x" : `${mv > 0 ? "+" : "-"} ${Math.abs(mv)}x`;
      const sq = cv === 1 ? "+ \\tfrac{1}{2} x^2" : "- \\tfrac{1}{2} x^2";
      return `${hv} ${lin} ${sq}`;
    };
    const f = (x: number) => h + m * x + (c * x * x) / 2;
    return pickChoice(
      rng,
      t(
        "The graph shows a function near $x = 0$. Which could be its second-degree Taylor polynomial at 0?",
        "图中是一个函数在 $x = 0$ 附近的图像。它在 0 处的二次泰勒多项式可能是哪个？",
      ),
      math(write(h, m, c)),
      [math(write(h, -m, c)), math(write(h, m, -c)), math(write(h, -m, -c)), math(write(-h, m, c))],
      t(
        `The height at 0 is ${h}, the slope there is ${m > 0 ? "positive" : "negative"}, and the curve bends ${c > 0 ? "upward, so the square term is positive" : "downward, so the square term is negative"}.`,
        `0 处的高度是 ${h}，那里的斜率为${m > 0 ? "正" : "负"}，曲线${c > 0 ? "向上弯，所以二次项为正" : "向下弯，所以二次项为负"}。`,
      ),
      drawn(
        square(4),
        [
          { kind: "curve", f, accent: true },
          { kind: "point", at: [0, h] },
        ],
        t(
          `A curve through (0, ${h}), ${m > 0 ? "rising" : "falling"} there and bending ${c > 0 ? "upward" : "downward"}.`,
          `一条过 (0, ${h}) 的曲线，在那里${m > 0 ? "上升" : "下降"}，并且${c > 0 ? "向上弯" : "向下弯"}。`,
        ),
      ),
    );
  },
};

const sequenceFromPlot: KnowledgePointDef = {
  id: "the-behavior-of-a-geometric-sequence-from-its-plot",
  title: t("A geometric sequence from its plot", "由散点图看几何数列"),
  explanation: t(
    "Plotting the terms of a sequence shows its behavior at a glance. When the common ratio has size below one, the dots close in on zero, and a negative ratio makes them jump between the two sides as they do. When the size is above one they run away. A ratio of exactly one or minus one keeps the same size for ever.",
    "画出数列的项，一眼就能看出它的走势。公比的绝对值小于 1 时，点逐渐靠近 0；公比为负时，它们同时在两侧来回跳动。绝对值大于 1 时，点会越跑越远。公比恰好为 1 或 -1 时，大小永远不变。",
  ),
  generate(rng) {
    const kinds = [
      { r: 0.5, tex: "\\frac{1}{2}", en: "It converges to 0, staying on one side", zh: "收敛到 0，且始终在同一侧" },
      { r: 0.75, tex: "\\frac{3}{4}", en: "It converges to 0, staying on one side", zh: "收敛到 0，且始终在同一侧" },
      { r: -0.5, tex: "-\\frac{1}{2}", en: "It converges to 0, alternating in sign", zh: "收敛到 0，且符号交替" },
      { r: -0.75, tex: "-\\frac{3}{4}", en: "It converges to 0, alternating in sign", zh: "收敛到 0，且符号交替" },
      { r: 1.25, tex: "\\frac{5}{4}", en: "It diverges, growing in size on one side", zh: "发散，在同一侧越来越大" },
      { r: -1.25, tex: "-\\frac{5}{4}", en: "It diverges, alternating in sign", zh: "发散，且符号交替" },
      { r: -1, tex: "-1", en: "It diverges, jumping between two values", zh: "发散，在两个值之间跳动" },
    ];
    const kind = rng.pick(kinds);
    const a = rng.int(1, 6);
    const dots = Array.from({ length: 9 }, (_, n): Point => [n, a * kind.r ** n]);
    const top = Math.ceil(Math.max(...dots.map(([, y]) => Math.abs(y)))) + 1;
    const scale = top / 5;
    const options = [...new Set(kinds.map((k) => k.en))];
    const zhOf = (en: string) => kinds.find((k) => k.en === en)?.zh ?? en;
    return pickChoice(
      rng,
      t(
        "The dots show the terms $a_0, a_1, a_2, \\dots$ of a geometric sequence. Which describes it?",
        "这些点是几何数列的项 $a_0, a_1, a_2, \\dots$。哪个说法正确？",
      ),
      t(kind.en, kind.zh),
      rng.shuffle(options.filter((o) => o !== kind.en)).map((o) => t(o, zhOf(o))),
      t(`The ratio between terms is $${kind.tex}$. ${kind.en}.`, `相邻项之比是 $${kind.tex}$。${kind.zh}。`),
      drawn(
        { xMin: -1, xMax: 9, yMin: -5, yMax: 5, labelEvery: 2 },
        dots.map(([x, y]): PlaneMark => ({ kind: "point", at: [x, y / scale], accent: true })),
        t(
          `Nine dots of a geometric sequence with first term ${a} and common ratio ${kind.r}. The vertical axis is not to scale.`,
          `首项为 ${a}、公比为 ${kind.r} 的几何数列的九个点。纵轴未按比例。`,
        ),
      ),
    );
  },
};

const petalLimits: KnowledgePointDef = {
  id: "the-limits-of-one-petal-from-a-drawing",
  title: t("The limits of one petal", "一片花瓣的积分限"),
  explanation: t(
    "A petal of a polar rose starts and ends where the radius is zero. For $r = a \\cos(k\\theta)$ this happens when $k\\theta$ is an odd multiple of a right angle, so the petal along the positive $x$-axis runs from $-\\frac{\\pi}{2k}$ to $\\frac{\\pi}{2k}$. Those values, and not a full turn, are the limits of the area integral for that single petal.",
    "极坐标玫瑰线的一片花瓣在半径为零处开始和结束。对 $r = a \\cos(k\\theta)$，这发生在 $k\\theta$ 是直角的奇数倍时，所以沿 $x$ 轴正向的花瓣从 $-\\frac{\\pi}{2k}$ 到 $\\frac{\\pi}{2k}$。单片花瓣的面积积分用这两个值作积分限，而不是转一整圈。",
  ),
  generate(rng) {
    const k = rng.int(2, 8);
    const a = rng.int(2, 5);
    const end = (d: number) => `\\frac{\\pi}{${d}}`;
    const shaded = parametric(
      (s) => [a * Math.cos(k * s) * Math.cos(s), a * Math.cos(k * s) * Math.sin(s)],
      -Math.PI / (2 * k),
      Math.PI / (2 * k),
      40,
    );
    const whole = parametric((s) => [a * Math.cos(k * s) * Math.cos(s), a * Math.cos(k * s) * Math.sin(s)], 0, 2 * Math.PI, 720);
    const limit = (d: number) => `\\theta \\text{ from } -${end(d)} \\text{ to } ${end(d)}`;
    return pickChoice(
      rng,
      t(
        `The drawing shows $r = ${a} \\cos(${k}\\theta)$. For the shaded petal, what are the limits of the area integral?`,
        `图中是 $r = ${a} \\cos(${k}\\theta)$。阴影花瓣的面积积分限是什么？`,
      ),
      math(limit(2 * k)),
      [
        math(limit(k)),
        math(`\\theta \\text{ from } 0 \\text{ to } ${end(2 * k)}`),
        math(`\\theta \\text{ from } 0 \\text{ to } 2\\pi`),
        math(limit(4 * k)),
      ],
      t(
        `The radius is zero when $${k}\\theta = \\pm \\frac{\\pi}{2}$, that is at $\\theta = \\pm ${end(2 * k)}$, and the shaded petal lies between these values.`,
        `当 $${k}\\theta = \\pm \\frac{\\pi}{2}$，即 $\\theta = \\pm ${end(2 * k)}$ 时半径为零，阴影花瓣就在这两个值之间。`,
      ),
      drawn(
        square(a + 1),
        [
          { kind: "polygon", points: shaded },
          { kind: "path", points: whole, accent: true },
        ],
        t(`A polar rose with its petal along the positive x-axis shaded.`, `一条极坐标玫瑰线，沿 x 轴正向的花瓣涂了阴影。`),
      ),
    );
  },
};

const seriesSumFromPlot: KnowledgePointDef = {
  id: "the-sum-of-a-series-from-its-partial-sums",
  title: t("A sum from its partial sums", "由部分和看级数的和"),
  explanation: t(
    "The sum of a series is by definition the limit of its partial sums. So plotting the partial sums shows whether the series converges: the dots settle toward a horizontal level, and that level is the sum. For a geometric series with first term $a$ and ratio $r$, that level is $\\frac{a}{1 - r}$, which you can compare with the plot.",
    "级数的和按定义是部分和的极限。所以画出部分和，就能看出级数是否收敛：点逐渐靠近一个水平高度，这个高度就是和。对首项为 $a$、公比为 $r$ 的几何级数，这个高度是 $\\frac{a}{1 - r}$，可以和图对照。",
  ),
  generate(rng) {
    const [num, den] = rng.pick([
      [1, 2],
      [1, 3],
      [2, 3],
      [1, 4],
      [3, 4],
    ] as const);
    const ratio = num / den;
    const sum = rng.int(2, 8);
    const first = Q.of(sum * (den - num), den);
    const dots = Array.from({ length: 9 }, (_, n): Point => [n + 1, sum * (1 - ratio ** (n + 1))]);
    const shown = first.toLatex();
    return numeric(
      t(
        `The dots show the partial sums $S_1, S_2, \\dots$ of a geometric series with ratio $\\frac{${num}}{${den}}$. What is the sum of the series?`,
        `这些点是公比为 $\\frac{${num}}{${den}}$ 的几何级数的部分和 $S_1, S_2, \\dots$。这个级数的和是多少？`,
      ),
      sum,
      [first, sum + 1, sum - 1, sum * 2, Q.of(sum * (den - num), num)],
      t(
        `The first dot gives the first term $${shown}$, and $${shown} \\div \\left(1 - \\frac{${num}}{${den}}\\right) = ${sum}$. This is the level that the dots approach.`,
        `第一个点给出首项 $${shown}$，而 $${shown} \\div \\left(1 - \\frac{${num}}{${den}}\\right) = ${sum}$。这正是这些点靠近的高度。`,
      ),
      drawn(
        { xMin: -1, xMax: 10, yMin: -1, yMax: sum + 2 },
        dots.map(([x, y]): PlaneMark => ({ kind: "point", at: [x, y], accent: true })),
        t(
          `Nine rising dots that start at height ${Math.round(first.toNumber() * 100) / 100} and level off at height ${sum}.`,
          `九个上升的点，从高度 ${Math.round(first.toNumber() * 100) / 100} 开始，逐渐靠近高度 ${sum}。`,
        ),
      ),
    );
  },
};

// ---------------------------------------------------------------------------
// Precalculus
// ---------------------------------------------------------------------------

const fociFromDrawing: KnowledgePointDef = {
  id: "the-foci-from-a-drawn-ellipse",
  title: t("The foci from a drawn ellipse", "由图中的椭圆求焦点"),
  explanation: t(
    "The drawing gives both semi-axes of an ellipse directly: $a$ is the longer distance from center to edge and $b$ is the shorter one. The foci sit on the longer axis, at a distance $c$ from the center with $c^2 = a^2 - b^2$. A common slip is to add the squares, as with a hyperbola, which puts the foci outside the curve.",
    "图直接给出椭圆的两个半轴：$a$ 是中心到边缘较长的距离，$b$ 是较短的距离。焦点在长轴上，到中心的距离 $c$ 满足 $c^2 = a^2 - b^2$。常见差错是像双曲线那样把平方相加，这会把焦点放到曲线外面。",
  ),
  generate(rng) {
    const triples = [
      [5, 4, 3],
      [10, 8, 6],
      [15, 12, 9],
      [20, 16, 12],
      [13, 12, 5],
      [17, 15, 8],
      [25, 24, 7],
    ] as const;
    const [a, first, second] = rng.pick(triples);
    const [b, c] = rng.bool() ? [first, second] : [second, first];
    const wide = rng.bool();
    const [p, q] = wide ? [a, b] : [b, a];
    const r = a + 2;
    return numeric(
      t("How far is each focus of this ellipse from its center?", "这个椭圆的每个焦点到中心的距离是多少？"),
      c,
      [a + b, a - b, a, b, Math.round(Math.hypot(a, b))],
      t(
        `The semi-axes are ${a} and ${b}, so $c^2 = ${a}^2 - ${b}^2 = ${c * c}$, and $c = ${c}$.`,
        `半轴是 ${a} 和 ${b}，所以 $c^2 = ${a}^2 - ${b}^2 = ${c * c}$，$c = ${c}$。`,
      ),
      drawn(
        { xMin: -r, xMax: r, yMin: -r, yMax: r, step: r > 12 ? 2 : 1, labelEvery: r > 20 ? 5 : r > 12 ? 3 : 2 },
        [
          { kind: "contour", f: (x, y) => (x * x) / (p * p) + (y * y) / (q * q), level: 1, accent: true },
          { kind: "point", at: [p, 0], label: `${p}`, dir: "se" },
          { kind: "point", at: [0, q], label: `${q}`, dir: "ne" },
        ],
        t(
          `An ellipse centered at the origin reaching ${p} along the x-axis and ${q} along the y-axis.`,
          `以原点为中心的椭圆，沿 x 轴到 ${p}，沿 y 轴到 ${q}。`,
        ),
      ),
      "integer",
    );
  },
};

const asymptotesFromDrawing: KnowledgePointDef = {
  id: "asymptote-slopes-from-a-drawn-hyperbola",
  title: t("Asymptote slopes from a drawn hyperbola", "由图中的双曲线求渐近线斜率"),
  explanation: t(
    "For a hyperbola opening left and right, the vertices are at distance $a$ from the center along the $x$-axis, and the asymptotes pass through the corners of a box with half-width $a$ and half-height $b$. So the slopes are $\\pm\\frac{b}{a}$. Reading the numbers from the grid, then checking against the dashed lines, avoids turning the fraction upside down.",
    "对向左右张开的双曲线，顶点在 $x$ 轴上到中心距离为 $a$ 的地方，渐近线经过半宽为 $a$、半高为 $b$ 的矩形的角。所以斜率是 $\\pm\\frac{b}{a}$。从网格读出数字，再和虚线对照，就不会把分数颠倒。",
  ),
  generate(rng) {
    const a = rng.int(1, 5);
    const b = rng.pick([1, 2, 3, 4, 5].filter((v) => v !== a && gcd(a, v) === 1));
    const sideways = rng.bool();
    const slope = Q.of(b, a);
    return numeric(
      t(
        "The dashed lines are the asymptotes of this hyperbola. What is the positive slope of an asymptote?",
        "虚线是这条双曲线的渐近线。正斜率的渐近线斜率是多少？",
      ),
      slope,
      [Q.of(a, b), Q.of(a + b, a), Q.of(b, a + b), Q.of(b * b, a * a)],
      t(
        `The vertices are at $${sideways ? "x" : "y"} = \\pm ${sideways ? a : b}$, and the marked point $(${a}, ${b})$ lies on an asymptote through the origin, so the slope is $${slope.toLatex()}$.`,
        `顶点在 $${sideways ? "x" : "y"} = \\pm ${sideways ? a : b}$，标出的点 $(${a}, ${b})$ 在过原点的渐近线上，所以斜率是 $${slope.toLatex()}$。`,
      ),
      drawn(
        square(7),
        [
          { kind: "contour", f: (x, y) => (sideways ? 1 : -1) * ((x * x) / (a * a) - (y * y) / (b * b)), level: 1, accent: true },
          { kind: "line", a: [0, 0], b: [a, b], dashed: true },
          { kind: "line", a: [0, 0], b: [a, -b], dashed: true },
          { kind: "point", at: [a, b] },
        ],
        t(
          `A hyperbola opening ${sideways ? "left and right" : "up and down"} with vertices at ${sideways ? "x" : "y"} = ±${sideways ? a : b}, and dashed asymptotes through (${a}, ${b}) and (${a}, -${b}).`,
          `向${sideways ? "左右" : "上下"}张开的双曲线，顶点在 ${sideways ? "x" : "y"} = ±${sideways ? a : b}，虚线渐近线经过 (${a}, ${b}) 和 (${a}, -${b})。`,
        ),
      ),
    );
  },
};

const sumOnComplexPlane: KnowledgePointDef = {
  id: "reading-a-sum-on-the-complex-plane",
  title: t("Reading a sum on the complex plane", "在复平面上读和"),
  explanation: t(
    "A complex number is a point of the plane, with the real part across and the imaginary part up. Adding complex numbers works like adding vectors: the real parts add and the imaginary parts add, which forms a parallelogram with the origin. So reading two points off the grid and adding by parts gives the fourth corner of that parallelogram.",
    "复数是平面上的点，实部是横向，虚部是纵向。复数加法和向量加法一样：实部相加，虚部相加，并和原点形成一个平行四边形。所以从网格读出两个点再按部分相加，就得到平行四边形的第四个顶点。",
  ),
  generate(rng) {
    const pickNonZero = () => rng.pick([-3, -2, -1, 1, 2, 3]);
    const [a, b, c, d] = [pickNonZero(), pickNonZero(), pickNonZero(), pickNonZero()];
    const write = (x: number, y: number) => {
      if (y === 0) return `${x}`;
      const im = Math.abs(y) === 1 ? "i" : `${Math.abs(y)}i`;
      if (x === 0) return `${y < 0 ? "-" : ""}${im}`;
      return `${x} ${y < 0 ? "-" : "+"} ${im}`;
    };
    const asksProduct = rng.bool();
    if (asksProduct) {
      return pickChoice(
        rng,
        t("The points show $z$ and $w$ in the complex plane. What is $z - w$?", "图中的点是复平面上的 $z$ 和 $w$。$z - w$ 是多少？"),
        math(write(a - c, b - d)),
        [math(write(c - a, d - b)), math(write(a + c, b + d)), math(write(a - c, b + d)), math(write(a + c, b - d))],
        t(
          `$z = ${write(a, b)}$ and $w = ${write(c, d)}$, and subtracting by parts gives $${write(a - c, b - d)}$.`,
          `$z = ${write(a, b)}$，$w = ${write(c, d)}$，按部分相减得 $${write(a - c, b - d)}$。`,
        ),
        drawn(
          square(4),
          [
            { kind: "point", at: [a, b], label: "z", dir: "ne", accent: true },
            { kind: "point", at: [c, d], label: "w", dir: "sw" },
          ],
          t(
            `Two points in the complex plane: z at (${a}, ${b}) and w at (${c}, ${d}).`,
            `复平面上的两个点：z 在 (${a}, ${b})，w 在 (${c}, ${d})。`,
          ),
        ),
      );
    }
    return pickChoice(
      rng,
      t("The points show $z$ and $w$ in the complex plane. What is $z + w$?", "图中的点是复平面上的 $z$ 和 $w$。$z + w$ 是多少？"),
      math(write(a + c, b + d)),
      [math(write(a - c, b - d)), math(write(c - a, d - b)), math(write(a + c, b - d)), math(write(a * c - b * d, a * d + b * c))],
      t(
        `$z = ${write(a, b)}$ and $w = ${write(c, d)}$, and adding by parts gives $${write(a + c, b + d)}$.`,
        `$z = ${write(a, b)}$，$w = ${write(c, d)}$，按部分相加得 $${write(a + c, b + d)}$。`,
      ),
      drawn(
        square(4),
        [
          { kind: "point", at: [a, b], label: "z", dir: "ne", accent: true },
          { kind: "point", at: [c, d], label: "w", dir: "sw" },
        ],
        t(
          `Two points in the complex plane: z at (${a}, ${b}) and w at (${c}, ${d}).`,
          `复平面上的两个点：z 在 (${a}, ${b})，w 在 (${c}, ${d})。`,
        ),
      ),
    );
  },
};

const argumentFromDrawing: KnowledgePointDef = {
  id: "the-argument-from-a-drawn-point",
  title: t("The argument from a drawn point", "由图中的点求辐角"),
  explanation: t(
    "The principal argument is the angle from the positive real axis to the point, between $-\\pi$ and $\\pi$. The quadrant must come from the picture, because the arctangent of the imaginary part over the real part cannot tell opposite points apart. So for a point in the third quadrant, the argument is a negative angle beyond minus a right angle, and not the angle given by the arctangent.",
    "主辐角是从正实轴到这个点的角，在 $-\\pi$ 到 $\\pi$ 之间。象限必须从图上看，因为虚部除以实部的反正切分不清相对的两个点。所以第三象限的点，辐角是比负直角更负的角，而不是反正切给出的那个角。",
  ),
  generate(rng) {
    const s = rng.int(1, 4);
    const options = [
      { x: 1, y: 0, tex: "0" },
      { x: 1, y: 1, tex: "\\frac{\\pi}{4}" },
      { x: 0, y: 1, tex: "\\frac{\\pi}{2}" },
      { x: -1, y: 1, tex: "\\frac{3\\pi}{4}" },
      { x: -1, y: 0, tex: "\\pi" },
      { x: -1, y: -1, tex: "-\\frac{3\\pi}{4}" },
      { x: 0, y: -1, tex: "-\\frac{\\pi}{2}" },
      { x: 1, y: -1, tex: "-\\frac{\\pi}{4}" },
    ];
    const right = rng.pick(options);
    const [x, y] = [right.x * s, right.y * s];
    const others = rng.shuffle(options.filter((o) => o !== right));
    return pickChoice(
      rng,
      t("What is the principal argument of the complex number $z$ drawn here?", "图中复数 $z$ 的主辐角是多少？"),
      math(right.tex),
      others.map((o) => math(o.tex)),
      t(
        `The point is at (${x}, ${y}). Measured from the positive real axis, with angles in $(-\\pi, \\pi]$, its angle is $${right.tex}$.`,
        `这个点在 (${x}, ${y})。从正实轴量起，角度取在 $(-\\pi, \\pi]$，它的角是 $${right.tex}$。`,
      ),
      drawn(
        square(5),
        [
          { kind: "arrow", from: [0, 0], to: [x, y], accent: true },
          { kind: "point", at: [x, y], label: "z", dir: x >= 0 ? "ne" : "nw" },
        ],
        t(`An arrow from the origin to z at (${x}, ${y}).`, `从原点指向 z 的箭头，z 在 (${x}, ${y})。`),
      ),
    );
  },
};

const rootsOnCircle: KnowledgePointDef = {
  id: "the-number-from-its-roots-on-a-circle",
  title: t("A number from its roots on a circle", "由圆上的根求原数"),
  explanation: t(
    "The $n$-th roots of a complex number lie evenly spaced on a circle around the origin. So the number of points gives $n$, and the radius of the circle is the $n$-th root of the size of the number. Reversing this, the size of the number is the radius raised to the power $n$, which can be read directly from a drawing of the roots.",
    "复数的 $n$ 次方根均匀分布在以原点为中心的圆上。所以点的个数就是 $n$，圆的半径是这个数的模的 $n$ 次方根。反过来，这个数的模就是半径的 $n$ 次方，可以直接从根的图中读出。",
  ),
  generate(rng) {
    const n = rng.int(3, 6);
    const r = rng.int(2, 3);
    const offset = rng.pick([0, 0.5, 0.3, 0.7]);
    const dots = Array.from(
      { length: n },
      (_, i): Point => [r * Math.cos(offset + (2 * Math.PI * i) / n), r * Math.sin(offset + (2 * Math.PI * i) / n)],
    );
    const answer = r ** n;
    return numeric(
      t(
        "The dots are all the roots of an equation $z^n = w$, for one complex number $w$. What is $|w|$?",
        "这些点是方程 $z^n = w$ 的全部根，$w$ 是一个复数。$|w|$ 是多少？",
      ),
      answer,
      [r * n, r, n, r ** (n - 1), n ** r, answer * r],
      t(
        `There are ${n} dots on a circle of radius ${r}, so $|w| = ${r}^{${n}} = ${answer}$.`,
        `半径为 ${r} 的圆上有 ${n} 个点，所以 $|w| = ${r}^{${n}} = ${answer}$。`,
      ),
      drawn(
        square(4),
        [{ kind: "circle", center: [0, 0], r, dashed: true }, ...dots.map((at): PlaneMark => ({ kind: "point", at, accent: true }))],
        t(
          `${n} dots evenly spaced on a dashed circle of radius ${r} around the origin.`,
          `半径为 ${r}、以原点为中心的虚线圆上，均匀分布着 ${n} 个点。`,
        ),
      ),
      "integer",
    );
  },
};

const amplitudePhaseFromGraph: KnowledgePointDef = {
  id: "amplitude-from-the-graph-of-a-sum",
  title: t("The amplitude of a sum from its graph", "由图读和的振幅"),
  explanation: t(
    "A sum of a sine and a cosine with the same frequency is one wave. Its amplitude is the square root of the sum of the squares of the coefficients, and not their sum, because the two waves do not peak at the same moment. A graph confirms this at a glance, as the highest point reached is this value.",
    "频率相同的正弦和余弦之和是一条波。它的振幅是系数平方和的平方根，而不是系数之和，因为两条波不在同一时刻达到峰值。图能一眼确认这一点，因为达到的最高点就是这个值。",
  ),
  generate(rng) {
    const [p, q, h] = rng.pick([
      [3, 4, 5],
      [4, 3, 5],
      [6, 8, 10],
      [8, 6, 10],
    ] as const);
    const a = rng.pick([1, -1]) * p;
    const b = rng.pick([1, -1]) * q;
    const w = rng.int(1, 3);
    const f = (x: number) => a * Math.sin(w * x) + b * Math.cos(w * x);
    const angle = (n: number) => (n === 1 ? "x" : `${n}x`);
    const write = (u: number, v: number, n: number) => `${u} \\sin ${angle(n)} ${v < 0 ? "-" : "+"} ${Math.abs(v)} \\cos ${angle(n)}`;
    return pickChoice(
      rng,
      t("Which function could have this graph?", "哪个函数可能有这样的图像？"),
      math(write(a, b, w)),
      [math(write(a, -b, w)), math(`${p + q} \\sin ${angle(w)}`), math(write(b, a, w)), math(write(a, b, w + 1))],
      t(
        `The peak is ${h}, and $\\sqrt{${p}^2 + ${q}^2} = ${h}$. At $x = 0$ the height is $${b}$, which is the coefficient of the cosine, and the wave has ${w === 1 ? "one cycle" : `${w} cycles`} in each $2\\pi$.`,
        `峰值是 ${h}，而 $\\sqrt{${p}^2 + ${q}^2} = ${h}$。$x = 0$ 时高度是 $${b}$，也就是余弦的系数，而且每个 $2\\pi$ 内有 ${w} 个周期。`,
      ),
      drawn(
        { xMin: -7, xMax: 7, yMin: -h - 1, yMax: h + 1, labelEvery: 2 },
        [{ kind: "curve", f, accent: true }],
        t(
          `A wave with peak ${h} that passes through (0, ${b}) and has ${w} cycles in each 2π.`,
          `一条峰值为 ${h} 的波，经过 (0, ${b})，每个 2π 内有 ${w} 个周期。`,
        ),
      ),
    );
  },
};

// ---------------------------------------------------------------------------
// Linear algebra
// ---------------------------------------------------------------------------

const rotationScalingFromDrawing: KnowledgePointDef = {
  id: "a-rotation-scaling-matrix-from-a-drawing",
  title: t("A rotation-scaling matrix from a drawing", "由图写旋转缩放矩阵"),
  explanation: t(
    "A rotation-scaling matrix has the form with $a$ and $-b$ on top, and $b$ and $a$ below. It sends the first basis vector to the point $(a, b)$. So the image of that one vector determines the whole matrix, and this is why the map is pictured so simply: every vector is turned by the same angle and stretched by the same factor.",
    "旋转缩放矩阵的形式是第一行为 $a$ 和 $-b$，第二行为 $b$ 和 $a$。它把第一个基向量送到点 $(a, b)$。所以这一个向量的像决定整个矩阵，这也是这种映射的图形如此简单的原因：每个向量都转过同样的角度并按同样的倍数伸缩。",
  ),
  generate(rng) {
    const pick = () => rng.pick([-3, -2, -1, 1, 2, 3]);
    const [a, b] = [pick(), pick()];
    const mat = (p: number, q: number, r: number, s: number) => `\\begin{pmatrix} ${p} & ${q} \\\\ ${r} & ${s} \\end{pmatrix}`;
    return pickChoice(
      rng,
      t(
        "A rotation-scaling matrix sends $e_1$ to the drawn vector. Which matrix is it?",
        "一个旋转缩放矩阵把 $e_1$ 送到图中的向量。它是哪个矩阵？",
      ),
      math(mat(a, -b, b, a)),
      [math(mat(a, b, -b, a)), math(mat(b, -a, a, b)), math(mat(a, b, b, -a)), math(mat(a, b, b, a))],
      t(
        `The image of $e_1$ is the first column, $(${a}, ${b})$. A rotation-scaling matrix then has second column $(${-b}, ${a})$.`,
        `$e_1$ 的像是第一列 $(${a}, ${b})$。旋转缩放矩阵的第二列就是 $(${-b}, ${a})$。`,
      ),
      drawn(
        square(4),
        [
          { kind: "arrow", from: [0, 0], to: [a, b], accent: true },
          { kind: "arrow", from: [0, 0], to: [1, 0] },
          { kind: "label", at: [1, 0], text: "e₁", dir: "s" },
        ],
        t(`The vector e₁ and its image at (${a}, ${b}).`, `向量 e₁ 和它的像，在 (${a}, ${b})。`),
      ),
    );
  },
};

const columnSpaceFromLine: KnowledgePointDef = {
  id: "the-column-space-from-a-drawn-line",
  title: t("The column space from a drawn line", "由图中的直线判断列空间"),
  explanation: t(
    "The column space of a matrix is the set of all combinations of its columns. When the two columns of a matrix are multiples of each other, every combination lies on one line through the origin, so the column space is that line. So to match a drawing, look for a matrix whose columns both point along the line, and not merely whose first column does.",
    "矩阵的列空间是它各列所有线性组合的集合。矩阵的两列互为倍数时，所有组合都在过原点的一条直线上，所以列空间就是这条直线。要和图对应，就要找两列都沿这条直线的矩阵，而不只是第一列沿这条直线。",
  ),
  generate(rng) {
    const directions: Point[] = [];
    for (let p = 1; p <= 5; p++) for (let q = 1; q <= 5; q++) if (p !== q || p === 1) if (gcd(p, q) === 1) directions.push([p, q], [p, -q]);
    const [u, v] = rng.pick(directions);
    const k = rng.pick([2, 3, -1, -2]);
    const mat = (p: number, q: number, r: number, s: number) => `\\begin{pmatrix} ${p} & ${q} \\\\ ${r} & ${s} \\end{pmatrix}`;
    return pickChoice(
      rng,
      t("The drawn line through the origin is the column space of which matrix?", "图中过原点的直线是哪个矩阵的列空间？"),
      math(mat(u, k * u, v, k * v)),
      [math(mat(v, k * v, u, k * u)), math(mat(u, v, k * u + 1, k * v)), math(mat(u, k * v, v, k * u - 1)), math(mat(u, u, -v, -v))],
      t(
        `Both columns are multiples of $(${u}, ${v})$, which is the direction of the line, so every combination of the columns lies on it.`,
        `两列都是 $(${u}, ${v})$ 的倍数，而这正是直线的方向，所以各列的任何组合都在这条直线上。`,
      ),
      drawn(
        square(6),
        [
          { kind: "line", a: [0, 0], b: [u, v], accent: true },
          { kind: "point", at: [u, v] },
        ],
        t(`A line through the origin and the point (${u}, ${v}).`, `一条过原点和点 (${u}, ${v}) 的直线。`),
      ),
    );
  },
};

const residualFromPlot: KnowledgePointDef = {
  id: "a-residual-from-a-scatter-plot",
  title: t("A residual from a scatter plot", "由散点图读残差"),
  explanation: t(
    "Least squares chooses the line that makes the squared vertical distances to the points as small as possible. Those vertical distances are the residuals: the actual value minus the value on the line. A point above the line has a positive residual, and one below has a negative residual. The horizontal distance to the line plays no part in this at all.",
    "最小二乘选择的直线，使各点到它的竖直距离的平方尽可能小。这些竖直距离就是残差：实际值减去直线上的值。线上方的点残差为正，下方的点残差为负。到直线的水平距离在这里完全不起作用。",
  ),
  generate(rng) {
    const m = rng.pick([1, 2, -1]);
    const b = m < 0 ? 6 : rng.int(0, 1);
    const xs = [1, 2, 3, 4];
    const offsets = xs.map(() => rng.pick([-2, -1, 1, 2]));
    const ys = xs.map((x, i) => m * x + b + (offsets[i] as number));
    const i = rng.int(0, 3);
    const [x, y] = [xs[i] as number, ys[i] as number];
    const fit = m * x + b;
    const answer = y - fit;
    const lineTex = `${m === 1 ? "" : m === -1 ? "-" : m}x${b === 0 ? "" : ` + ${b}`}`;
    const names = ["A", "B", "C", "D"];
    return numeric(
      t(
        `The drawn line is $y = ${lineTex}$. What is the residual of point ${names[i]}?`,
        `图中的直线是 $y = ${lineTex}$。点 ${names[i]} 的残差是多少？`,
      ),
      answer,
      [-answer, y, fit, x, answer + 1, answer - 1],
      t(
        `At $x = ${x}$ the line has height ${fit}, and the point has height ${y}, so the residual is $${y} - ${fit < 0 ? `(${fit})` : fit} = ${answer}$.`,
        `在 $x = ${x}$ 处直线的高度是 ${fit}，点的高度是 ${y}，所以残差是 $${y} - ${fit < 0 ? `(${fit})` : fit} = ${answer}$。`,
      ),
      drawn(
        { xMin: -1, xMax: 6, yMin: -2, yMax: 12, labelEvery: 2 },
        [
          { kind: "curve", f: (u) => m * u + b, accent: true },
          ...xs.map(
            (u, j): PlaneMark => ({
              kind: "point",
              at: [u, ys[j] as number],
              label: names[j] as string,
              dir: (offsets[j] as number) > 0 ? "n" : "s",
            }),
          ),
        ],
        t(
          `The line y = ${lineTex} with four points A, B, C and D at heights ${ys.join(", ")}.`,
          `直线 y = ${lineTex} 和四个点 A、B、C、D，高度依次为 ${ys.join("、")}。`,
        ),
      ),
      "integer",
    );
  },
};

// ---------------------------------------------------------------------------
// Differential equations
// ---------------------------------------------------------------------------

/** slopeField draws short segments with the slope a differential equation gives at the grid points. */
function slopeField(f: (x: number, y: number) => number, r = 3): PlaneMark[] {
  const marks: PlaneMark[] = [];
  for (let x = -r; x <= r; x++)
    for (let y = -r; y <= r; y++) {
      const m = f(x, y);
      const scale = 0.35 / Math.hypot(1, m);
      marks.push({ kind: "segment", a: [x - scale, y - scale * m], b: [x + scale, y + scale * m], accent: true });
    }
  return marks;
}

/** shifted writes a letter minus a constant, without a stray zero or double sign. */
const shifted = (letter: string, c: number) => (c === 0 ? letter : `${letter} ${c < 0 ? "+" : "-"} ${Math.abs(c)}`);

/** fieldChoices lists differential equations whose slope fields can be told apart by looking. */
const fieldChoices: readonly { tex: string; f: (x: number, y: number) => number; en: string; zh: string }[] = [
  ...[-2, -1, 0, 1, 2].flatMap((c) => [
    {
      tex: `y' = ${shifted("y", c)}`,
      f: (_x: number, y: number) => y - c,
      en: `slopes depend only on $y$, are zero along $y = ${c}$, and are positive above it`,
      zh: `斜率只取决于 $y$，沿 $y = ${c}$ 为零，在它上方为正`,
    },
    {
      tex: `y' = ${c === 0 ? "-y" : `${c} - y`}`,
      f: (_x: number, y: number) => c - y,
      en: `slopes depend only on $y$, are zero along $y = ${c}$, and are negative above it`,
      zh: `斜率只取决于 $y$，沿 $y = ${c}$ 为零，在它上方为负`,
    },
    {
      tex: `y' = ${shifted("x", c)}`,
      f: (x: number) => x - c,
      en: `slopes depend only on $x$, are zero along $x = ${c}$, and are positive to its right`,
      zh: `斜率只取决于 $x$，沿 $x = ${c}$ 为零，在它右边为正`,
    },
    {
      tex: `y' = ${c === 0 ? "-x" : `${c} - x`}`,
      f: (x: number) => c - x,
      en: `slopes depend only on $x$, are zero along $x = ${c}$, and are negative to its right`,
      zh: `斜率只取决于 $x$，沿 $x = ${c}$ 为零，在它右边为负`,
    },
  ]),
  {
    tex: "y' = x + y",
    f: (x, y) => x + y,
    en: "slopes are zero along the line $y = -x$, and are positive above it",
    zh: "沿直线 $y = -x$ 斜率为零，在它上方为正",
  },
  {
    tex: "y' = -x - y",
    f: (x, y) => -x - y,
    en: "slopes are zero along the line $y = -x$, and are negative above it",
    zh: "沿直线 $y = -x$ 斜率为零，在它上方为负",
  },
  {
    tex: "y' = x - y",
    f: (x, y) => x - y,
    en: "slopes are zero along the line $y = x$, and are negative above it",
    zh: "沿直线 $y = x$ 斜率为零，在它上方为负",
  },
  {
    tex: "y' = y - x",
    f: (x, y) => y - x,
    en: "slopes are zero along the line $y = x$, and are positive above it",
    zh: "沿直线 $y = x$ 斜率为零，在它上方为正",
  },
  { tex: "y' = y^2", f: (_x, y) => y * y, en: "slopes depend only on $y$, and are never negative", zh: "斜率只取决于 $y$，且不为负" },
  { tex: "y' = -y^2", f: (_x, y) => -y * y, en: "slopes depend only on $y$, and are never positive", zh: "斜率只取决于 $y$，且不为正" },
  {
    tex: "y' = xy",
    f: (x, y) => x * y,
    en: "slopes are zero along both axes, and are positive in the first quadrant",
    zh: "沿两条坐标轴斜率都为零，在第一象限为正",
  },
  {
    tex: "y' = -xy",
    f: (x, y) => -x * y,
    en: "slopes are zero along both axes, and are negative in the first quadrant",
    zh: "沿两条坐标轴斜率都为零，在第一象限为负",
  },
];

const matchingSlopeField: KnowledgePointDef = {
  id: "matching-a-slope-field-to-its-equation",
  title: t("Matching a slope field to its equation", "把斜率场与方程对应"),
  explanation: t(
    "Look at a slope field in columns and rows. If the segments in each vertical column are parallel, the slope depends only on $x$. If those in each horizontal row are parallel, it depends only on $y$. Then find where the segments are flat, since those are the places where the right side is zero. These two checks usually settle which equation it is.",
    "按列和行来看斜率场。如果每一竖列的线段都平行，斜率只取决于 $x$。如果每一横行的线段都平行，斜率只取决于 $y$。再找线段水平的地方，那里右端等于零。这两项检查通常就能确定是哪个方程。",
  ),
  generate(rng) {
    const right = rng.pick(fieldChoices);
    const others = rng.shuffle(fieldChoices.filter((c) => c !== right)).slice(0, 3);
    return pickChoice(
      rng,
      t("Which differential equation has this slope field?", "哪个微分方程有这样的斜率场？"),
      math(right.tex),
      others.map((c) => math(c.tex)),
      t(`Here ${right.en}, which matches $${right.tex}$.`, `这里${right.zh}，与 $${right.tex}$ 相符。`),
      drawn(
        square(4),
        slopeField(right.f),
        t(`A slope field in which ${right.en.replaceAll("$", "")}.`, `一个斜率场：${right.zh.replaceAll("$", "")}。`),
      ),
    );
  },
};

const eulerFromField: KnowledgePointDef = {
  id: "one-euler-step-from-a-drawing",
  title: t("One Euler step from a drawing", "由图走一步欧拉法"),
  explanation: t(
    "Euler's method follows the slope at the current point for a short step. So the new height is the old height plus the step size times the slope. On a drawing, the slope at the start point can be read from the segment through it, and this makes clear what the method does: it walks along a tangent, and so it drifts away from a curving solution.",
    "欧拉法沿当前点的斜率走一小步。所以新的高度是旧的高度加步长乘斜率。在图上，起点的斜率可以从过它的线段读出，这也说明了这个方法在做什么：它沿切线走，所以会逐渐偏离弯曲的解。",
  ),
  generate(rng) {
    const x0 = rng.int(-2, 1);
    const y0 = rng.int(-3, 2);
    const m = rng.pick([-2, -1, 1, 2, 3]);
    const hs = rng.pick([1, 2]);
    const h = Q.of(1, hs);
    const answer = Q.of(y0).add(h.mul(Q.of(m)));
    return numeric(
      t(
        `A solution of a differential equation passes through the marked point, and the dashed segment shows the slope there. With step size $${h.toLatex()}$, what value of $y$ does one step of Euler's method give?`,
        `一个微分方程的解经过标出的点，虚线段表示那里的斜率。步长为 $${h.toLatex()}$ 时，走一步欧拉法得到的 $y$ 值是多少？`,
      ),
      answer,
      [Q.of(y0 + m), Q.of(y0).sub(h.mul(Q.of(m))), h.mul(Q.of(m)), Q.of(y0).add(h), Q.of(y0), answer.add(Q.of(1)), answer.sub(Q.of(1))],
      t(
        `The slope is ${m}, read as the rise over one unit across. So $y_1 = ${y0} + ${h.toLatex()} \\times ${m < 0 ? `(${m})` : m} = ${answer.toLatex()}$.`,
        `斜率是 ${m}，即横向一个单位的上升量。所以 $y_1 = ${y0} + ${h.toLatex()} \\times ${m < 0 ? `(${m})` : m} = ${answer.toLatex()}$。`,
      ),
      drawn(
        square(6),
        [
          { kind: "segment", a: [x0, y0], b: [x0 + 1, y0 + m], dashed: true, accent: true },
          { kind: "point", at: [x0, y0], accent: true },
        ],
        t(
          `The point (${x0}, ${y0}), with a dashed segment to (${x0 + 1}, ${y0 + m}).`,
          `点 (${x0}, ${y0})，以及连到 (${x0 + 1}, ${y0 + m}) 的虚线段。`,
        ),
      ),
    );
  },
};

const logisticFromGraph: KnowledgePointDef = {
  id: "reading-a-logistic-curve",
  title: t("Reading a logistic curve", "读 logistic 曲线"),
  explanation: t(
    "A logistic curve rises slowly, then quickly, then levels off at the carrying capacity. The growth rate is the product of the population and the room that is left, so it is largest at half of the capacity. This is the inflection point of the curve, where its bending changes direction, and it can be spotted on a graph as the steepest place.",
    "logistic 曲线先慢慢上升，再快速上升，然后在环境容量处变平。增长率是种群数量和剩余空间的积，所以在容量的一半处最大。这是曲线的拐点，弯曲方向在这里改变，在图上就是最陡的地方。",
  ),
  generate(rng) {
    const half = rng.pick([2, 3, 4]);
    const capacity = 2 * half * 5;
    const mid = rng.int(3, 7);
    const f = (x: number) => (2 * half) / (1 + Math.exp(-1.2 * (x - mid)));
    const asksFastest = rng.bool();
    const answer = asksFastest ? half * 5 : capacity;
    return numeric(
      t(
        asksFastest
          ? "This logistic curve shows a population, with each grid unit up standing for 5 animals. At what population is the growth fastest?"
          : "This logistic curve shows a population, with each grid unit up standing for 5 animals. What is the carrying capacity?",
        asksFastest
          ? "这条 logistic 曲线表示种群数量，纵向每格代表 5 只动物。种群数量为多少时增长最快？"
          : "这条 logistic 曲线表示种群数量，纵向每格代表 5 只动物。环境容量是多少？",
      ),
      answer,
      asksFastest ? [capacity, 2 * half, half, mid] : [half * 5, 2 * half, capacity * 5, mid],
      t(
        asksFastest
          ? `The curve levels off at ${2 * half} grid units, which is ${capacity} animals. Growth is fastest at half of this, ${half * 5}.`
          : `The curve levels off at ${2 * half} grid units, and each stands for 5 animals, so the capacity is ${capacity}.`,
        asksFastest
          ? `曲线在 ${2 * half} 格处变平，也就是 ${capacity} 只动物。增长最快时是它的一半，${half * 5}。`
          : `曲线在 ${2 * half} 格处变平，每格代表 5 只动物，所以容量是 ${capacity}。`,
      ),
      drawn(
        { xMin: -1, xMax: 11, yMin: -1, yMax: 11, labelEvery: 2 },
        [
          { kind: "curve", f, from: 0, to: 11, accent: true },
          { kind: "line", a: [0, 2 * half], b: [1, 2 * half], dashed: true },
        ],
        t(
          `An S-shaped curve that levels off at the dashed line at height ${2 * half}, and is steepest at x = ${mid}.`,
          `一条 S 形曲线，在高度 ${2 * half} 的虚线处变平，在 x = ${mid} 处最陡。`,
        ),
      ),
      "integer",
    );
  },
};

const stepFromGraph: KnowledgePointDef = {
  id: "a-step-function-from-its-graph",
  title: t("A step function from its graph", "由图写阶跃函数"),
  explanation: t(
    "The unit step $u(t - a)$ is zero before a and one after it, so a multiple of it switches on a constant at time a. A jump in a graph therefore corresponds to one step term whose coefficient is the size of the jump, up or down. Reading the graph from left to right, write one such term for each jump, starting from the initial level.",
    "单位阶跃 $u(t - a)$ 在 a 之前为零，之后为一，所以它的倍数在 a 时刻接通一个常数。因此图上的一次跳跃对应一个阶跃项，系数是跳跃的大小，向上或向下。从左到右读图，从初始高度开始，每次跳跃写一项。",
  ),
  generate(rng) {
    const a = rng.int(1, 3);
    const b = a + rng.int(1, 3);
    const h1 = rng.pick([1, 2, 3, 4]);
    const h2 = rng.pick([1, 2, 3, 4].filter((v) => v !== h1));
    const step = (c: number, d: number) => `${c === 1 ? "" : `${c} `}u(t - ${d})`;
    const signed = (c: number, d: number) => `${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : `${Math.abs(c)} `}u(t - ${d})`;
    const expr = (first: number, d1: number, change: number, d2: number) => `${step(first, d1)} ${signed(change, d2)}`;
    return pickChoice(
      rng,
      t("Which function has this graph?", "哪个函数有这样的图像？"),
      math(expr(h1, a, h2 - h1, b)),
      [
        math(expr(h1, a, h2, b)),
        math(expr(h2, a, h1 - h2, b)),
        math(h2 - h1 === h1 ? expr(h1 + 1, a, h2 - h1, b) : expr(h1, b, h2 - h1, a)),
      ],
      t(
        `The graph jumps by ${h1} at $t = ${a}$, and by $${h2 - h1}$ at $t = ${b}$. Each jump gives one step term with that coefficient.`,
        `图像在 $t = ${a}$ 处跳了 ${h1}，在 $t = ${b}$ 处跳了 $${h2 - h1}$。每次跳跃给出一个以此为系数的阶跃项。`,
      ),
      drawn(
        { xMin: -1, xMax: 8, yMin: -1, yMax: 6 },
        [
          { kind: "segment", a: [0, 0], b: [a, 0], accent: true },
          { kind: "segment", a: [a, h1], b: [b, h1], accent: true },
          { kind: "segment", a: [b, h2], b: [8, h2], accent: true },
        ],
        t(
          `A graph at height 0 up to t = ${a}, then at height ${h1} up to t = ${b}, and then at height ${h2}.`,
          `图像在 t = ${a} 之前高度为 0，之后到 t = ${b} 高度为 ${h1}，再之后高度为 ${h2}。`,
        ),
      ),
    );
  },
};

// ---------------------------------------------------------------------------
// Multivariable calculus
// ---------------------------------------------------------------------------

const criticalPointFromContours: KnowledgePointDef = {
  id: "classifying-a-critical-point-from-level-curves",
  title: t("Classifying a critical point from level curves", "由等值线判断临界点"),
  explanation: t(
    "Level curves near a critical point show its type. Closed loops around it mean a local extremum, and the levels tell which: values that rise toward the center mean a maximum, and values that fall toward it mean a minimum. Curves shaped like an X, or like hyperbolas in opposite pairs, mean a saddle, where the function rises one way and falls the other.",
    "临界点附近的等值线显示了它的类型。环绕它的闭合曲线表示局部极值，等值线的数值说明是哪一种：向中心增大是极大值，向中心减小是极小值。形如 X、或成对相对的双曲线，表示鞍点，那里函数沿一个方向上升，沿另一个方向下降。",
  ),
  generate(rng) {
    const kind = rng.pick(["max", "min", "saddle"] as const);
    const a = rng.int(1, 3);
    const b = rng.pick([1, 2, 3].filter((v) => v !== a));
    const shift = rng.int(4, 9);
    const f = (x: number, y: number) =>
      kind === "max" ? -(a * x * x + b * y * y) : kind === "min" ? a * x * x + b * y * y : a * x * x - b * y * y;
    const levels = kind === "saddle" ? [1, 4, -1, -4] : kind === "max" ? [-1, -4, -9] : [1, 4, 9];
    const labelled = levels.slice(0, 3).map((l) => `${shift + l}`);
    const rightText =
      kind === "max"
        ? t("A local maximum", "局部极大值")
        : kind === "min"
          ? t("A local minimum", "局部极小值")
          : t("A saddle point", "鞍点");
    const options = [
      t("A local maximum", "局部极大值"),
      t("A local minimum", "局部极小值"),
      t("A saddle point", "鞍点"),
      t("Not a critical point", "不是临界点"),
    ];
    return pickChoice(
      rng,
      t(
        kind === "saddle"
          ? `These are level curves of $f$ at the levels ${labelled.join(", ")} and ${shift - 4} near the origin, which is a critical point. What is the origin?`
          : `These are level curves of $f$ near the origin, which is a critical point, at the levels ${labelled.join(", ")} from the inside out. What is the origin?`,
        kind === "saddle"
          ? `这些是 $f$ 在原点附近的等值线，数值为 ${labelled.join("、")} 和 ${shift - 4}，原点是临界点。原点是什么？`
          : `这些是 $f$ 在原点附近的等值线，从里到外数值为 ${labelled.join("、")}，原点是临界点。原点是什么？`,
      ),
      rightText,
      options.filter((o) => o.en !== rightText.en),
      t(
        kind === "saddle"
          ? "The curves are hyperbolas in opposite pairs, so the function rises in one direction and falls in the other."
          : `The curves are closed loops, and the values ${kind === "max" ? "rise" : "fall"} toward the center.`,
        kind === "saddle"
          ? "这些曲线是成对相对的双曲线，所以函数沿一个方向上升，沿另一个方向下降。"
          : `这些曲线是闭合的，数值向中心${kind === "max" ? "增大" : "减小"}。`,
      ),
      drawn(
        square(4),
        levels.map((level): PlaneMark => ({ kind: "contour", f, level, accent: true })),
        t(
          kind === "saddle"
            ? "Level curves that are hyperbolas in opposite pairs around the origin."
            : "Level curves that are closed ellipses around the origin.",
          kind === "saddle" ? "等值线是围绕原点成对相对的双曲线。" : "等值线是围绕原点的闭合椭圆。",
        ),
      ),
    );
  },
};

const workSignFromDrawing: KnowledgePointDef = {
  id: "the-sign-of-the-work-from-a-drawing",
  title: t("The sign of the work from a drawing", "由图判断功的符号"),
  explanation: t(
    "The line integral of a field along a curve adds up the part of the field along the direction of travel. So where the arrows point along the path the contribution is positive, where they point against it the contribution is negative, and where they cross at a right angle the contribution is zero. Reversing the direction of the path changes the sign of the integral.",
    "向量场沿曲线的线积分，把场在行进方向上的分量累加起来。所以箭头顺着路径时贡献为正，逆着路径时为负，直角穿过时为零。把路径方向反过来，积分就变号。",
  ),
  generate(rng) {
    const [u, v] = rng.pick([
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 1],
      [-1, 1],
      [1, -1],
      [-1, -1],
    ] as const);
    const [dx, dy] = rng.pick([
      [3, 0],
      [0, 3],
      [-3, 0],
      [0, -3],
      [2, 2],
      [-2, 2],
      [2, -2],
      [-2, -2],
    ] as const);
    const start: Point = [-dx / 2, -dy / 2];
    const end: Point = [dx / 2, dy / 2];
    const dot = u * dx + v * dy;
    const arrows: PlaneMark[] = [];
    for (let x = -3; x <= 3; x += 2)
      for (let y = -3; y <= 3; y += 2) arrows.push({ kind: "arrow", from: [x, y], to: [x + u * 0.7, y + v * 0.7], thin: true });
    const [right, others] =
      dot > 0
        ? [t("Positive", "正"), [t("Negative", "负"), t("Zero", "零")]]
        : dot < 0
          ? [t("Negative", "负"), [t("Positive", "正"), t("Zero", "零")]]
          : [t("Zero", "零"), [t("Positive", "正"), t("Negative", "负")]];
    return pickChoice(
      rng,
      t(
        "The field is constant, as the thin arrows show. What is the sign of the work done by the field along the thick arrow?",
        "如细箭头所示，这个场是常向量场。沿粗箭头，场做的功符号如何？",
      ),
      right,
      [...others, t("It depends on the speed along the path", "取决于沿路径的速度")],
      t(
        `The dot product of the field and the direction of travel is ${dot < 0 ? `$${dot}$` : dot}, so the work is ${dot > 0 ? "positive" : dot < 0 ? "negative" : "zero"}. The speed does not matter.`,
        `场与行进方向的点积是 ${dot < 0 ? `$${dot}$` : dot}，所以功${dot > 0 ? "为正" : dot < 0 ? "为负" : "为零"}。速度没有影响。`,
      ),
      drawn(
        square(4),
        [...arrows, { kind: "arrow", from: start, to: end, accent: true }],
        t(
          `A constant field with direction (${u}, ${v}), and a path in the direction (${dx}, ${dy}).`,
          `方向为 (${u}, ${v}) 的常向量场，以及方向为 (${dx}, ${dy}) 的路径。`,
        ),
      ),
    );
  },
};

const polarFromPoint: KnowledgePointDef = {
  id: "polar-coordinates-from-a-drawn-point",
  title: t("Polar coordinates from a drawn point", "由图中的点写极坐标"),
  explanation: t(
    "Polar coordinates of a point give its distance from the origin and its angle from the positive x-axis. Both can be read from a drawing: the radius with the Pythagorean theorem, and the angle from the quadrant. The formula with the arctangent gives only an angle in the right half of the plane, so a picture guards against being off by half a turn.",
    "点的极坐标给出它到原点的距离和相对于 x 轴正向的角。两者都能从图上读出：半径用勾股定理，角由象限决定。用反正切的公式只给出右半平面的角，所以图可以防止差出半圈。",
  ),
  generate(rng) {
    const directions = [
      [1, 1, "\\frac{\\pi}{4}"],
      [-1, 1, "\\frac{3\\pi}{4}"],
      [-1, -1, "\\frac{5\\pi}{4}"],
      [1, -1, "\\frac{7\\pi}{4}"],
      [1, 0, "0"],
      [0, 1, "\\frac{\\pi}{2}"],
      [-1, 0, "\\pi"],
      [0, -1, "\\frac{3\\pi}{2}"],
    ] as const;
    const [ux, uy, tex] = rng.pick(directions);
    const size = rng.int(1, 5);
    const [x, y] = [ux * size, uy * size];
    const axial = ux === 0 || uy === 0;
    const r = axial ? `${size}` : size === 1 ? "\\sqrt{2}" : `${size}\\sqrt{2}`;
    const other = rng.shuffle(directions.map((d) => d[2] as string).filter((a) => a !== tex));
    return pickChoice(
      rng,
      t(
        "What are the polar coordinates $(r, \\theta)$ of the point, with $r > 0$ and $0 \\le \\theta < 2\\pi$?",
        "这个点的极坐标 $(r, \\theta)$ 是什么？要求 $r > 0$，$0 \\le \\theta < 2\\pi$。",
      ),
      math(`\\left(${r}, ${tex}\\right)`),
      [math(`\\left(${r}, ${other[0]}\\right)`), math(`\\left(${2 * size}, ${tex}\\right)`), math(`\\left(${r}, ${other[1]}\\right)`)],
      t(
        `The point is at (${x}, ${y}), so $r = ${r}$. Its position relative to the axes gives the angle $${tex}$.`,
        `这个点在 (${x}, ${y})，所以 $r = ${r}$。由它相对坐标轴的位置得到角 $${tex}$。`,
      ),
      drawn(
        square(6),
        [
          { kind: "segment", a: [0, 0], b: [x, y], dashed: true },
          { kind: "point", at: [x, y], accent: true },
        ],
        t(`The point (${x}, ${y}).`, `点 (${x}, ${y})。`),
      ),
    );
  },
};

// ---------------------------------------------------------------------------
// Probability and statistics
// ---------------------------------------------------------------------------

/** pmfFigure draws a probability mass function as bars, with heights in tenths. */
function pmfFigure(values: readonly number[], tenths: readonly number[], alt: Text): Figure {
  const left = 40;
  const base = 170;
  const step = 240 / values.length;
  const parts: string[] = [];
  for (let i = 0; i <= 5; i++) {
    const y = base - i * 30;
    parts.push(`<line x1="${left}" y1="${y}" x2="310" y2="${y}" stroke-width="0.5" stroke-opacity="0.35"/>`);
    parts.push(label(left - 16, y + 4, (i / 10).toFixed(1), 'font-size="10"'));
  }
  values.forEach((v, i) => {
    const x = left + step * (i + 0.5);
    const h = (tenths[i] as number) * 30;
    parts.push(`<rect class="accent" x="${x - 14}" y="${base - h}" width="28" height="${h}" fill="currentColor" fill-opacity="0.4"/>`);
    parts.push(label(x, base + 16, `${v}`));
  });
  parts.push(`<line x1="${left}" y1="${base}" x2="310" y2="${base}"/>`);
  return { svg: svgDocument(195, parts.join("")), alt };
}

const expectedFromBars: KnowledgePointDef = {
  id: "the-expected-value-from-a-bar-chart",
  title: t("The expected value from a bar chart", "由条形图求期望"),
  explanation: t(
    "A probability bar chart gives each value of a random variable and its probability. The expected value multiplies each value by the height of its bar and adds the results. It is the balance point of the chart, and not the value of the tallest bar, which is the mode. Check first that the heights add up to one, as they must.",
    "概率条形图给出随机变量的每个值和它的概率。期望把每个值乘它的条的高度再相加。它是这张图的平衡点，而不是最高的条对应的值，那是众数。先检查高度之和是否等于 1，这是必须满足的。",
  ),
  generate(rng) {
    const values = [1, 2, 3, 4];
    const shapes = [
      [1, 2, 3, 4],
      [4, 3, 2, 1],
      [1, 4, 4, 1],
      [2, 3, 3, 2],
      [3, 1, 1, 5],
      [5, 2, 2, 1],
      [1, 1, 3, 5],
      [2, 2, 4, 2],
      [3, 4, 2, 1],
      [1, 5, 3, 1],
    ];
    const tenths = rng.pick(shapes);
    const start = rng.int(0, 5);
    const vals = values.map((v) => v + start);
    const sum = vals.reduce((total, v, i) => total + v * (tenths[i] as number), 0);
    const answer = Q.of(sum, 10);
    const mode = vals[tenths.indexOf(Math.max(...tenths))] as number;
    const mean = vals.reduce((a, b) => a + b, 0) / 4;
    return numeric(
      t("The bars give the probability of each value of $X$. What is $E[X]$?", "这些条给出 $X$ 每个值的概率。$E[X]$ 是多少？"),
      answer,
      [Q.of(mode), Q.of(Math.round(mean * 2), 2), Q.of(sum), answer.add(Q.of(1, 2))],
      t(
        `$E[X] = ${vals.map((v, i) => `${v} \\times ${(tenths[i] as number) / 10}`).join(" + ")} = ${(sum / 10).toString()}$.`,
        `$E[X] = ${vals.map((v, i) => `${v} \\times ${(tenths[i] as number) / 10}`).join(" + ")} = ${(sum / 10).toString()}$。`,
      ),
      pmfFigure(
        vals,
        tenths,
        t(
          `Bars at ${vals.join(", ")} with heights ${tenths.map((v) => v / 10).join(", ")}.`,
          `在 ${vals.join("、")} 处的条，高度分别是 ${tenths.map((v) => v / 10).join("、")}。`,
        ),
      ),
      "decimal",
    );
  },
};

const empiricalFromCurve: KnowledgePointDef = {
  id: "the-empirical-rule-from-a-shaded-curve",
  title: t("The empirical rule from a shaded curve", "由阴影曲线用经验法则"),
  explanation: t(
    "About 68 percent of a normal distribution lies within one standard deviation of the mean, 95 percent within two, and 99.7 percent within three. The curve is symmetric, so half of each of these lies on either side of the mean. Translate the shaded bounds into standard deviations from the mean, and then combine the pieces of the rule that are needed.",
    "正态分布约 68% 落在均值一个标准差之内，95% 在两个标准差之内，99.7% 在三个标准差之内。曲线是对称的，所以这些比例在均值两侧各占一半。把阴影边界换算成离均值几个标准差，再把需要的部分组合起来。",
  ),
  generate(rng) {
    const mu = 10 * rng.int(5, 12);
    const sigma = rng.pick([2, 4, 5, 10, 15]);
    const cases = [
      { lo: -1, hi: 1, tenths: 680 },
      { lo: -2, hi: 2, tenths: 950 },
      { lo: -3, hi: 3, tenths: 997 },
      { lo: 0, hi: 1, tenths: 340 },
      { lo: 0, hi: 2, tenths: 475 },
      { lo: -1, hi: 0, tenths: 340 },
      { lo: -2, hi: 0, tenths: 475 },
      { lo: 1, hi: 2, tenths: 135 },
      { lo: -2, hi: 1, tenths: 815 },
    ];
    const c = rng.pick(cases);
    const answer = Q.of(c.tenths, 10);
    const W = 320;
    const px = (z: number) => Math.round((W / 2 + z * 44) * 10) / 10;
    const py = (z: number) => Math.round((150 - 120 * Math.exp((-z * z) / 2)) * 10) / 10;
    const zs = Array.from({ length: 81 }, (_, i) => -3.5 + (i * 7) / 80);
    const shade = Array.from({ length: 41 }, (_, i) => c.lo + ((c.hi - c.lo) * i) / 40);
    const svg = svgDocument(
      180,
      `<polygon class="accent" points="${px(c.lo)},150 ${shade.map((z) => `${px(z)},${py(z)}`).join(" ")} ${px(c.hi)},150" fill="currentColor" fill-opacity="0.3" stroke="none"/><polyline class="accent" points="${zs.map((z) => `${px(z)},${py(z)}`).join(" ")}"/><line x1="${px(-3.5)}" y1="150" x2="${px(3.5)}" y2="150"/>${[-3, -2, -1, 0, 1, 2, 3].map((z) => `<line x1="${px(z)}" y1="146" x2="${px(z)}" y2="154"/>${label(px(z), 170, `${mu + z * sigma}`, 'font-size="11"')}`).join("")}`,
    );
    return numeric(
      t(
        `A normal distribution has mean ${mu} and standard deviation ${sigma}. According to the empirical rule, what percent of it lies in the shaded region?`,
        `一个正态分布的均值是 ${mu}，标准差是 ${sigma}。按经验法则，阴影区域占多少百分比？`,
      ),
      answer,
      [Q.of(68), Q.of(95), Q.of(34), Q.of(50), Q.of(c.tenths === 475 ? 950 : 475, 10)],
      t(
        `The bounds ${mu + c.lo * sigma} and ${mu + c.hi * sigma} are $${c.lo}$ and $${c.hi}$ standard deviations from the mean. By the rule and the symmetry of the curve, this region holds ${c.tenths / 10}%.`,
        `边界 ${mu + c.lo * sigma} 和 ${mu + c.hi * sigma} 分别离均值 $${c.lo}$ 和 $${c.hi}$ 个标准差。由经验法则和曲线的对称性，这个区域占 ${c.tenths / 10}%。`,
      ),
      {
        svg,
        alt: t(
          `A normal curve, shaded between ${mu + c.lo * sigma} and ${mu + c.hi * sigma}.`,
          `一条正态曲线，在 ${mu + c.lo * sigma} 和 ${mu + c.hi * sigma} 之间涂了阴影。`,
        ),
      },
      "decimal",
    );
  },
};

const correlationFromScatter: KnowledgePointDef = {
  id: "the-correlation-from-a-scatter-plot",
  title: t("The correlation from a scatter plot", "由散点图看相关系数"),
  explanation: t(
    "The correlation coefficient measures how closely points follow a straight line. Its sign tells whether the line rises or falls, and its size how tight the cloud is around the line: near one is tight and near zero is a shapeless cloud. It says nothing about how steep the line is, so a shallow tight cloud can have a larger correlation than a steep loose one.",
    "相关系数衡量点有多接近一条直线。它的符号说明直线是上升还是下降，它的大小说明点云围绕直线有多紧：接近 1 很紧，接近 0 则是没有形状的点云。它和直线有多陡无关，所以平缓而紧的点云，相关系数可能比陡而松的点云大。",
  ),
  generate(rng) {
    const kinds = [
      { r: "0.95", slope: 1, noise: 0.45 },
      { r: "-0.95", slope: -1, noise: 0.45 },
      { r: "0.5", slope: 0.7, noise: 2.3 },
      { r: "-0.5", slope: -0.7, noise: 2.3 },
      { r: "0", slope: 0, noise: 3 },
    ];
    const kind = rng.pick(kinds);
    const dots: PlaneMark[] = [];
    for (let i = 0; i < 28; i++) {
      const x = -5 + rng.int(0, 100) / 10;
      const e = (kind.noise * (rng.int(0, 100) + rng.int(0, 100) - 100)) / 100;
      const y = Math.max(-5.8, Math.min(5.8, kind.slope * x + e));
      dots.push({ kind: "point", at: [x, y], accent: true });
    }
    return pickChoice(
      rng,
      t("Which is the best estimate of the correlation coefficient of these points?", "这些点的相关系数最接近哪个值？"),
      math(kind.r),
      kinds.filter((k) => k !== kind).map((k) => math(k.r)),
      t(
        kind.r === "0"
          ? "The cloud shows no rising or falling trend, so the correlation is close to zero."
          : `The points ${kind.slope > 0 ? "rise" : "fall"} from left to right, and they are ${Math.abs(kind.slope) === 1 ? "tightly" : "loosely"} grouped around a line, so the estimate is ${kind.r}.`,
        kind.r === "0"
          ? "点云没有上升或下降的趋势，所以相关系数接近零。"
          : `这些点从左到右${kind.slope > 0 ? "上升" : "下降"}，并且${Math.abs(kind.slope) === 1 ? "紧密" : "松散"}地分布在一条直线周围，所以估计值是 ${kind.r}。`,
      ),
      drawn(
        square(6),
        dots,
        t(`A scatter plot of 28 points with a correlation near ${kind.r}.`, `28 个点的散点图，相关系数接近 ${kind.r}。`),
      ),
    );
  },
};

/** treeFigure draws a two-level probability tree. */
function treeFigure(a: string, notA: string, ba: string, bn: string, alt: Text): Figure {
  const text = (x: number, y: number, s: string) => label(x, y, s, 'font-size="12"');
  const lines: [Point, Point][] = [
    [
      [40, 110],
      [150, 55],
    ],
    [
      [40, 110],
      [150, 165],
    ],
    [
      [150, 55],
      [270, 25],
    ],
    [
      [150, 55],
      [270, 85],
    ],
    [
      [150, 165],
      [270, 135],
    ],
    [
      [150, 165],
      [270, 195],
    ],
  ];
  return {
    svg: svgDocument(
      220,
      lines.map(([p, q]) => `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`).join("") +
        text(85, 70, a) +
        text(85, 160, notA) +
        text(205, 28, ba) +
        text(205, 138, bn) +
        text(162, 48, "A") +
        text(162, 180, "A′") +
        text(285, 29, "B") +
        text(285, 89, "B′") +
        text(285, 139, "B") +
        text(285, 199, "B′"),
    ),
    alt,
  };
}

const totalFromTree: KnowledgePointDef = {
  id: "reading-a-probability-tree",
  title: t("Reading a probability tree", "读概率树"),
  explanation: t(
    "A probability tree splits by the first event and then by the second. Multiplying along a branch gives the probability of that whole path, and adding the paths that end in the second event gives its total probability. Bayes' theorem reverses the question: it divides one such path by that total, to see what share of the second event came through the first.",
    "概率树先按第一个事件分，再按第二个事件分。沿一条分支相乘，得到这条路径的概率；把以第二个事件结尾的路径相加，得到它的总概率。贝叶斯定理把问题反过来：用一条这样的路径除以总概率，看第二个事件中有多大比例来自第一个事件。",
  ),
  generate(rng) {
    const a = rng.pick([2, 3, 4, 5, 6, 8]);
    const ba = rng.pick([2, 4, 5, 6, 8]);
    const bn = rng.pick([1, 2, 3, 5].filter((v) => v !== ba));
    const pathA = a * ba;
    const pathN = (10 - a) * bn;
    const total = pathA + pathN;
    const answer = Q.of(total, 100);
    return numeric(
      t("Using this probability tree, what is $P(B)$?", "根据这棵概率树，$P(B)$ 是多少？"),
      answer,
      [Q.of(pathA, 100), Q.of(pathN, 100), Q.of(ba + bn, 10), Q.of(100 - total, 100)],
      t(
        `Add the two paths that end in B: $${a / 10} \\times ${ba / 10} + ${(10 - a) / 10} \\times ${bn / 10} = ${total / 100}$.`,
        `把以 B 结尾的两条路径相加：$${a / 10} \\times ${ba / 10} + ${(10 - a) / 10} \\times ${bn / 10} = ${total / 100}$。`,
      ),
      treeFigure(
        `${a / 10}`,
        `${(10 - a) / 10}`,
        `${ba / 10}`,
        `${bn / 10}`,
        t(
          `A tree with P(A) = ${a / 10}, P(B | A) = ${ba / 10} and P(B | A′) = ${bn / 10}.`,
          `一棵概率树：P(A) = ${a / 10}，P(B | A) = ${ba / 10}，P(B | A′) = ${bn / 10}。`,
        ),
      ),
      "decimal",
    );
  },
};

const bayesFromTree: KnowledgePointDef = {
  id: "reversing-a-probability-tree",
  title: t("Reversing a probability tree", "把概率树反过来"),
  explanation: t(
    "Given a tree that goes from A to B, the reverse probability of A given B is not on the drawing, and it must be calculated. Take the path that passes through A and ends in B, and divide by all the paths that end in B. Confusing this with the probability of B given A, which is on the drawing, is the base-rate error that Bayes' theorem corrects.",
    "给定从 A 到 B 的树，已知 B 时 A 的反向概率不在图上，必须计算。取经过 A 并以 B 结尾的路径，除以所有以 B 结尾的路径。把它和图上已知 A 时 B 的概率弄混，就是贝叶斯定理所纠正的基础比率错误。",
  ),
  generate(rng) {
    const a = rng.pick([2, 3, 4, 5, 6, 8]);
    const ba = rng.pick([2, 4, 5, 6, 8]);
    const bn = rng.pick([1, 2, 3, 5].filter((v) => v !== ba));
    const pathA = a * ba;
    const total = pathA + (10 - a) * bn;
    const answer = Q.of(pathA, total);
    return numeric(
      t(
        "Using this probability tree, what is $P(A \\mid B)$? Answer as a fraction.",
        "根据这棵概率树，$P(A \\mid B)$ 是多少？用分数作答。",
      ),
      answer,
      [Q.of(ba, 10), Q.of(a, 10), Q.of(pathA, 100), Q.of(total, 100), Q.of((10 - a) * bn, total)],
      t(
        `The path through A has probability $${pathA / 100}$, and all paths ending in B total $${total / 100}$. Their ratio is $${answer.toLatex()}$.`,
        `经过 A 的路径概率是 $${pathA / 100}$，以 B 结尾的路径总概率是 $${total / 100}$。它们的比是 $${answer.toLatex()}$。`,
      ),
      treeFigure(
        `${a / 10}`,
        `${(10 - a) / 10}`,
        `${ba / 10}`,
        `${bn / 10}`,
        t(
          `A tree with P(A) = ${a / 10}, P(B | A) = ${ba / 10} and P(B | A′) = ${bn / 10}.`,
          `一棵概率树：P(A) = ${a / 10}，P(B | A) = ${ba / 10}，P(B | A′) = ${bn / 10}。`,
        ),
      ),
      "fraction",
    );
  },
};

// ---------------------------------------------------------------------------
// Methods of proof
// ---------------------------------------------------------------------------

/** vennFigure draws two overlapping circles in a box and shades one combination of regions. */
function vennFigure(
  regions: { inA: boolean; inB: boolean; both: boolean; out: boolean },
  names: readonly [string, string],
  alt: Text,
): Figure {
  const [r, cy, ax, bx] = [58, 95, 125, 195];
  const dx = (bx - ax) / 2;
  const h = Math.round(Math.sqrt(r * r - dx * dx) * 10) / 10;
  const [mx, topY, lowY] = [(ax + bx) / 2, cy - h, cy + h];
  const fill = (d: string, rule = "") => `<path class="accent" d="${d}" fill="currentColor" fill-opacity="0.35" stroke="none"${rule}/>`;
  const lens = `M ${mx} ${topY} A ${r} ${r} 0 0 1 ${mx} ${lowY} A ${r} ${r} 0 0 1 ${mx} ${topY} Z`;
  const leftMoon = `M ${mx} ${topY} A ${r} ${r} 0 1 0 ${mx} ${lowY} A ${r} ${r} 0 0 1 ${mx} ${topY} Z`;
  const rightMoon = `M ${mx} ${topY} A ${r} ${r} 0 1 1 ${mx} ${lowY} A ${r} ${r} 0 0 0 ${mx} ${topY} Z`;
  const union = `M ${mx} ${topY} A ${r} ${r} 0 1 0 ${mx} ${lowY} A ${r} ${r} 0 1 0 ${mx} ${topY} Z`;
  const box = "M 30 12 H 290 V 178 H 30 Z";
  const parts = [
    regions.out ? fill(`${box} ${union}`, ' fill-rule="evenodd"') : "",
    regions.inA ? fill(leftMoon) : "",
    regions.inB ? fill(rightMoon) : "",
    regions.both ? fill(lens) : "",
    `<rect x="30" y="12" width="260" height="166"/><circle cx="${ax}" cy="${cy}" r="${r}"/><circle cx="${bx}" cy="${cy}" r="${r}"/>`,
    label(92, 40, names[0]),
    label(228, 40, names[1]),
  ];
  return { svg: svgDocument(190, parts.join("")), alt };
}

const vennCases = [
  { tex: "A \\cap B", inA: false, inB: false, both: true, out: false, en: "only the overlap", zh: "只有重叠部分" },
  { tex: "A \\cup B", inA: true, inB: true, both: true, out: false, en: "both circles", zh: "两个圆" },
  { tex: "A \\setminus B", inA: true, inB: false, both: false, out: false, en: "the part of A outside B", zh: "A 在 B 之外的部分" },
  { tex: "B \\setminus A", inA: false, inB: true, both: false, out: false, en: "the part of B outside A", zh: "B 在 A 之外的部分" },
  {
    tex: "(A \\cup B)^c",
    inA: false,
    inB: false,
    both: false,
    out: true,
    en: "everything outside both circles",
    zh: "两个圆之外的所有部分",
  },
  { tex: "(A \\cap B)^c", inA: true, inB: true, both: false, out: true, en: "everything except the overlap", zh: "除重叠部分外的所有部分" },
  { tex: "A^c", inA: false, inB: true, both: false, out: true, en: "everything outside A", zh: "A 之外的所有部分" },
  { tex: "B^c", inA: true, inB: false, both: false, out: true, en: "everything outside B", zh: "B 之外的所有部分" },
] as const;

const vennFromDrawing: KnowledgePointDef = {
  id: "naming-a-shaded-venn-region",
  title: t("Naming a shaded Venn region", "说出维恩图的阴影区域"),
  explanation: t(
    "A diagram of two sets has four regions: the part only in A, the part only in B, the overlap, and the outside. Every set built with union, intersection and complement is some group of these regions. So work out the expression region by region. De Morgan's laws are easy to see this way, as the complement of a union is the outside region alone.",
    "两个集合的图有四个区域：只在 A 中的部分、只在 B 中的部分、重叠部分，以及外面。用并、交、补构成的每个集合都是这些区域的某个组合。所以要逐个区域地求表达式。这样很容易看出德摩根律，因为并集的补就是外面那一个区域。",
  ),
  generate(rng) {
    const [first, second] = rng.pick([
      ["A", "B"],
      ["P", "Q"],
      ["S", "T"],
      ["X", "Y"],
    ] as const);
    const name = (text: string) => text.replaceAll("A", first).replaceAll("B", second);
    const right = rng.pick(vennCases);
    const others = rng.shuffle(vennCases.filter((c) => c !== right)).slice(0, 3);
    return pickChoice(
      rng,
      t("Which set is shaded?", "哪个集合涂了阴影？"),
      math(name(right.tex)),
      others.map((c) => math(name(c.tex))),
      t(`The shading covers ${name(right.en)}, which is $${name(right.tex)}$.`, `阴影覆盖${name(right.zh)}，也就是 $${name(right.tex)}$。`),
      vennFigure(
        right,
        [first, second],
        t(
          `Two overlapping sets ${first} and ${second}, with ${name(right.en)} shaded.`,
          `两个相交的集合 ${first} 和 ${second}，${name(right.zh)}涂了阴影。`,
        ),
      ),
    );
  },
};

const mapKinds = [
  { left: 3, right: 3, arrows: [1, 2, 0], key: "bijective" },
  { left: 3, right: 3, arrows: [2, 0, 1], key: "bijective" },
  { left: 3, right: 4, arrows: [0, 2, 3], key: "injective" },
  { left: 3, right: 4, arrows: [3, 1, 0], key: "injective" },
  { left: 2, right: 4, arrows: [1, 3], key: "injective" },
  { left: 4, right: 3, arrows: [0, 1, 2, 2], key: "surjective" },
  { left: 4, right: 3, arrows: [2, 0, 0, 1], key: "surjective" },
  { left: 4, right: 2, arrows: [0, 1, 1, 0], key: "surjective" },
  { left: 3, right: 3, arrows: [0, 0, 2], key: "neither" },
  { left: 3, right: 3, arrows: [1, 1, 1], key: "neither" },
  { left: 4, right: 4, arrows: [0, 1, 1, 3], key: "neither" },
  { left: 4, right: 4, arrows: [3, 0, 2, 1], key: "bijective" },
  { left: 3, right: 4, arrows: [0, 0, 1], key: "neither" },
  { left: 4, right: 3, arrows: [1, 1, 2, 2], key: "neither" },
] as const;

const mapFromDrawing: KnowledgePointDef = {
  id: "the-kind-of-function-from-an-arrow-diagram",
  title: t("The kind of function from an arrow diagram", "由箭头图判断函数的类型"),
  explanation: t(
    "An arrow diagram shows the definitions directly. A function is injective when no element on the right receives two arrows, and surjective when every element on the right receives at least one. A function that is both is bijective. Counting helps as well: with more elements on the left than on the right, a function cannot be injective, and with fewer it cannot be surjective.",
    "箭头图直接显示了定义。右边没有元素收到两个箭头时，函数是单射；右边每个元素至少收到一个箭头时，函数是满射。两者都是就是双射。数数也有帮助：左边的元素比右边多时，函数不可能是单射；比右边少时，不可能是满射。",
  ),
  generate(rng) {
    const shape = rng.pick(mapKinds);
    const shuffleRight = rng.shuffle(Array.from({ length: shape.right }, (_, i) => i));
    const arrows = shape.arrows.map((a) => shuffleRight[a] as number);
    const leftNames = rng.shuffle(["a", "b", "c", "d"]).slice(0, shape.left);
    const rightNames = Array.from({ length: shape.right }, (_, i) => `${i + 1}`);
    const words = {
      bijective: t("Bijective (both injective and surjective)", "双射（既是单射又是满射）"),
      injective: t("Injective but not surjective", "单射但不是满射"),
      surjective: t("Surjective but not injective", "满射但不是单射"),
      neither: t("Neither injective nor surjective", "既不是单射也不是满射"),
    };
    const hit = new Set(arrows);
    const twice = hit.size < arrows.length;
    const missed = hit.size < shape.right;
    return pickChoice(
      rng,
      t(
        "The arrows show a function from the left set to the right set. What kind is it?",
        "这些箭头表示从左边集合到右边集合的函数。它是什么类型？",
      ),
      words[shape.key],
      Object.entries(words)
        .filter(([key]) => key !== shape.key)
        .map(([, value]) => value),
      t(
        `${twice ? "An element on the right receives two arrows, so it is not injective" : "No element on the right receives two arrows, so it is injective"}. ${missed ? "An element on the right receives none, so it is not surjective" : "Every element on the right receives an arrow, so it is surjective"}.`,
        `${twice ? "右边有元素收到两个箭头，所以不是单射" : "右边没有元素收到两个箭头，所以是单射"}。${missed ? "右边有元素没收到箭头，所以不是满射" : "右边每个元素都收到箭头，所以是满射"}。`,
      ),
      mapFigure(
        leftNames,
        rightNames,
        arrows,
        t(
          `An arrow diagram: ${leftNames.map((n, i) => `${n} to ${(arrows[i] as number) + 1}`).join(", ")}.`,
          `箭头图：${leftNames.map((n, i) => `${n} 到 ${(arrows[i] as number) + 1}`).join("，")}。`,
        ),
      ),
    );
  },
};

const relationCases = [
  {
    names: 3,
    edges: [
      [0, 0],
      [1, 1],
      [2, 2],
      [0, 1],
      [1, 0],
    ],
    key: "reflexive-symmetric",
  },
  {
    names: 3,
    edges: [
      [0, 1],
      [1, 0],
      [1, 2],
      [2, 1],
    ],
    key: "symmetric",
  },
  {
    names: 3,
    edges: [
      [0, 0],
      [1, 1],
      [2, 2],
      [0, 1],
      [1, 2],
      [0, 2],
    ],
    key: "reflexive-antisym",
  },
  {
    names: 3,
    edges: [
      [0, 1],
      [1, 2],
      [0, 2],
    ],
    key: "antisym",
  },
  {
    names: 4,
    edges: [
      [0, 1],
      [1, 0],
      [2, 3],
      [3, 2],
    ],
    key: "symmetric",
  },
  {
    names: 4,
    edges: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [2, 3],
      [3, 2],
    ],
    key: "reflexive-symmetric",
  },
  {
    names: 4,
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [0, 3],
    ],
    key: "antisym",
  },
  {
    names: 4,
    edges: [
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [0, 1],
      [2, 3],
    ],
    key: "reflexive-antisym",
  },
] as const;

const relationFromDigraph: KnowledgePointDef = {
  id: "properties-of-a-relation-from-its-digraph",
  title: t("Properties of a relation from its digraph", "由有向图判断关系的性质"),
  explanation: t(
    "A relation on a set can be drawn as a graph with an arrow from x to y whenever x is related to y. It is reflexive when every point has a loop. It is symmetric when every arrow has a partner going back, and antisymmetric when no two different points have arrows in both directions. A property fails as soon as one point or one arrow breaks it.",
    "集合上的关系可以画成图：x 和 y 有关系时，就画一个从 x 到 y 的箭头。每个点都有自环时，关系是自反的。每个箭头都有一个返回的箭头时，关系是对称的；没有两个不同的点互相有箭头时，关系是反对称的。只要一个点或一个箭头不符合，这个性质就不成立。",
  ),
  generate(rng) {
    const c = rng.pick(relationCases);
    const names = rng.shuffle(["a", "b", "c", "d", "e"]).slice(0, c.names);
    const words = {
      "reflexive-symmetric": t("Reflexive and symmetric", "自反且对称"),
      symmetric: t("Symmetric but not reflexive", "对称但不自反"),
      "reflexive-antisym": t("Reflexive and antisymmetric", "自反且反对称"),
      antisym: t("Antisymmetric but not reflexive", "反对称但不自反"),
    };
    const list = c.edges.map(([a, b]) => `${names[a]} to ${names[b]}`).join(", ");
    const listZh = c.edges.map(([a, b]) => `${names[a]} 到 ${names[b]}`).join("，");
    const hasLoops = c.key.startsWith("reflexive");
    const isSym = c.key.endsWith("symmetric") && c.key !== "reflexive-antisym";
    return pickChoice(
      rng,
      t("Which describes the relation drawn here?", "哪个说法描述了图中的关系？"),
      words[c.key],
      Object.entries(words)
        .filter(([k]) => k !== c.key)
        .map(([, w]) => w),
      t(
        `${hasLoops ? "Every point has a loop" : "Some point has no loop"}. ${isSym ? "Every arrow has one going back" : "No two different points have arrows both ways"}.`,
        `${hasLoops ? "每个点都有自环" : "有的点没有自环"}。${isSym ? "每个箭头都有返回的箭头" : "没有两个不同的点互相有箭头"}。`,
      ),
      graphFigure(names, c.edges, true, t(`A directed graph with arrows ${list}.`, `一个有向图，箭头为：${listZh}。`)),
    );
  },
};

const floorFromGraph: KnowledgePointDef = {
  id: "reading-a-floor-graph",
  title: t("Reading a floor graph", "读取整函数的图"),
  explanation: t(
    "The floor function gives the largest integer that does not exceed its input. Its graph is a staircase, with a filled dot at the left end of each step and an open dot at the right end. So reading it at a whole number means taking the height of the step that begins there, and this is the point most often misread from a drawing.",
    "取整函数给出不超过输入的最大整数。它的图像是一段段台阶，每段左端是实心点，右端是空心点。所以在整数处读图，要取从那里开始的台阶的高度，这是最容易读错的地方。",
  ),
  generate(rng) {
    const c = rng.int(-2, 2);
    const marks: PlaneMark[] = [];
    for (let i = -4; i < 4; i++) {
      const y = i + c;
      marks.push(
        { kind: "segment", a: [i, y], b: [i + 1, y], accent: true },
        { kind: "point", at: [i, y], accent: true },
        { kind: "point", at: [i + 1, y], open: true },
      );
    }
    const x = rng.int(-6, 6) / 2;
    const answer = Math.floor(x) + c;
    const height = answer < 0 ? `$${answer}$` : `${answer}`;
    const whole = Number.isInteger(x);
    return numeric(
      t(
        `The graph is the floor function moved up or down. What is its value at $x = ${x}$?`,
        `这个图像是取整函数上下平移的结果。它在 $x = ${x}$ 处的值是多少？`,
      ),
      answer,
      [answer - 1, answer + 1, answer + 2, answer - 2],
      t(
        whole
          ? `At $x = ${x}$ the filled dot is at height ${height}. The open dot there, one step lower, is not part of the graph.`
          : `The point $x = ${x}$ lies inside the step that begins at $x = ${Math.floor(x)}$, and that step has height ${height}.`,
        whole
          ? `在 $x = ${x}$ 处实心点的高度是 ${height}。那里低一格的空心点不在图像上。`
          : `$x = ${x}$ 在从 $x = ${Math.floor(x)}$ 开始的台阶内部，这段台阶的高度是 ${height}。`,
      ),
      drawn(
        { xMin: -5, xMax: 5, yMin: -7, yMax: 7 },
        marks,
        t(
          `A staircase with a filled dot at the left end of each step and an open dot at the right end. The step that begins at x = 0 has height ${c}.`,
          `一段台阶图，每段左端是实心点，右端是空心点。从 x = 0 开始的台阶高度是 ${c}。`,
        ),
      ),
      "integer",
    );
  },
};

const productFromDots: KnowledgePointDef = {
  id: "a-factor-from-a-cartesian-product-plot",
  title: t("A factor from a plotted product", "由笛卡尔积的图读因子"),
  explanation: t(
    "The Cartesian product of two sets of numbers can be drawn as a grid of dots in the plane. The first coordinates of the dots make up the first set, and the second coordinates make up the second. So the number of dots is the product of the sizes of the sets, and each set can be read off by looking along one axis.",
    "两个数集的笛卡尔积可以画成平面上的点阵。这些点的第一个坐标组成第一个集合，第二个坐标组成第二个集合。所以点的个数等于两个集合大小的积，每个集合都可以沿一条坐标轴读出来。",
  ),
  generate(rng) {
    const pool = [-3, -2, -1, 1, 2, 3, 4];
    const size = (n: number) =>
      rng
        .shuffle(pool)
        .slice(0, n)
        .sort((p, q) => p - q);
    const A = size(rng.int(2, 4));
    const B = size(rng.int(2, 4));
    const marks: PlaneMark[] = [];
    for (const a of A) for (const b of B) marks.push({ kind: "point", at: [a, b], accent: true });
    const set = (s: readonly number[]) => `\\{${s.join(", ")}\\}`;
    const asksA = rng.bool();
    const right = asksA ? A : B;
    const other = asksA ? B : A;
    const extra = pool.filter((v) => !right.includes(v));
    const wrongOne = [...right.slice(1), extra[0] as number].sort((p, q) => p - q);
    return pickChoice(
      rng,
      t(
        `The dots show the product $A \\times B$. What is ${asksA ? "$A$" : "$B$"}?`,
        `这些点表示 $A \\times B$。${asksA ? "$A$" : "$B$"} 是什么？`,
      ),
      math(set(right)),
      [
        math(set(other)),
        math(set(right.map((v) => v + 1))),
        math(set(wrongOne)),
        math(set(right.slice(1).length > 0 ? right.slice(1) : right)),
        math(set(right.map((v) => -v).sort((p, q) => p - q))),
      ],
      t(
        asksA ? `The first coordinates of the dots are $${A.join(", ")}$.` : `The second coordinates of the dots are $${B.join(", ")}$.`,
        asksA ? `这些点的第一个坐标是 $${A.join(", ")}$。` : `这些点的第二个坐标是 $${B.join(", ")}$。`,
      ),
      drawn(
        square(5),
        marks,
        t(
          `Dots at the points of a grid, with x in ${A.join(", ")} and y in ${B.join(", ")}.`,
          `网格上的点，x 取 ${A.join("、")}，y 取 ${B.join("、")}。`,
        ),
      ),
    );
  },
};

// ---------------------------------------------------------------------------
// Abstract algebra
// ---------------------------------------------------------------------------

const cayleyReading: KnowledgePointDef = {
  id: "reading-a-cayley-table",
  title: t("Reading a Cayley table", "读凯莱表"),
  explanation: t(
    "A Cayley table lists every product of a group. The identity is the element whose row and column repeat the headings, and the inverse of an element is found by locating the identity in its row. The order of an element comes from multiplying by it repeatedly and reading each result, until the identity appears, and the count of the steps taken is that order.",
    "凯莱表列出了群中所有的积。单位元是行和列都重复表头的元素；要求一个元素的逆，就在它的那一行找单位元。元素的阶，要反复乘它并读出每个结果，直到出现单位元，所走的步数就是阶。",
  ),
  generate(rng) {
    const n = rng.int(4, 6);
    const pool = ["a", "b", "c", "d", "e", "f", "g", "h", "p", "q", "r", "s"];
    const names = rng.shuffle(pool).slice(0, n);
    const heads = rng.shuffle(names.map((_, i) => i));
    const name = (i: number) => names[((i % n) + n) % n] as string;
    const cells = heads.map((i) => heads.map((j) => name(i + j)));
    const figure = tableFigure(
      heads.map(name),
      cells,
      t(
        `A Cayley table with headings ${heads.map(name).join(", ")}. Its rows read ${cells.map((row) => row.join(" ")).join("; ")}.`,
        `凯莱表，表头为 ${heads.map(name).join("、")}，各行依次为 ${cells.map((row) => row.join(" ")).join("；")}。`,
      ),
    );
    const x = rng.int(1, n - 1);
    const kind = rng.int(0, 2);
    if (kind === 0)
      return pickChoice(
        rng,
        t("What is the identity element of this group?", "这个群的单位元是什么？"),
        t(name(0), name(0)),
        names.filter((v) => v !== name(0)).map((v) => t(v, v)),
        t(`The row and column of ${name(0)} repeat the headings.`, `${name(0)} 的行和列都重复表头。`),
        figure,
      );
    if (kind === 1)
      return pickChoice(
        rng,
        t(`What is the inverse of ${name(x)} in this group?`, `这个群中 ${name(x)} 的逆元是什么？`),
        t(name(-x), name(-x)),
        names.filter((v) => v !== name(-x)).map((v) => t(v, v)),
        t(
          `In the row of ${name(x)}, the identity ${name(0)} appears in the column of ${name(-x)}.`,
          `在 ${name(x)} 的那一行，单位元 ${name(0)} 出现在 ${name(-x)} 那一列。`,
        ),
        figure,
      );
    const order = n / gcd(n, x);
    return numeric(
      t(`What is the order of ${name(x)} in this group?`, `这个群中 ${name(x)} 的阶是多少？`),
      order,
      [n, x, n - order, order + 1, order === 1 ? 2 : order - 1],
      t(
        `Repeated products of ${name(x)} reach the identity ${name(0)} after ${order} steps.`,
        `${name(x)} 反复相乘，${order} 步后到达单位元 ${name(0)}。`,
      ),
      figure,
      "integer",
    );
  },
};

const cayleyDiagramWalk: KnowledgePointDef = {
  id: "walking-a-cayley-diagram",
  title: t("Walking a Cayley diagram", "在凯莱图上行走"),
  explanation: t(
    "A Cayley diagram has a point for each group element, and an arrow for multiplying by a generator. Multiplying by a power of that generator means following the arrows that many times. So the group's structure becomes geometry: a single cycle of arrows through all the points means the generator produces the whole group, and the length of a cycle is the generator's order.",
    "凯莱图中每个群元素对应一个点，乘生成元对应一个箭头。乘生成元的几次方，就是沿箭头走几次。所以群的结构变成了几何：一个箭头圈经过所有点，表示这个生成元生成整个群；圈的长度就是生成元的阶。",
  ),
  generate(rng) {
    const n = rng.int(5, 8);
    const step = rng.pick(Array.from({ length: n - 1 }, (_, i) => i + 1));
    const edges: [number, number][] = Array.from({ length: n }, (_, i) => [i, (i + step) % n]);
    const start = rng.int(0, n - 1);
    const moves = rng.int(2, 2 * n);
    const answer = (start + moves * step) % n;
    const names = Array.from({ length: n }, (_, i) => `${i}`);
    const figure = graphFigure(
      names,
      edges,
      true,
      t(
        `A Cayley diagram on 0 to ${n - 1}, with an arrow from each x to x + ${step} mod ${n}.`,
        `0 到 ${n - 1} 上的凯莱图，每个 x 都有一个箭头指向 x + ${step} mod ${n}。`,
      ),
    );
    return numeric(
      t(
        `Each arrow in this Cayley diagram adds one generator. Start at ${start} and follow ${moves} arrows. Where do you end?`,
        `这个凯莱图的每个箭头加上一个生成元。从 ${start} 出发，走 ${moves} 个箭头。最后到哪里？`,
      ),
      answer,
      [
        (start + moves) % n,
        (moves * step) % n,
        (answer + 1) % n,
        (answer + step) % n,
        (start + step) % n,
        (answer + 2) % n,
        (answer + 3) % n,
      ],
      t(
        `Each arrow adds ${step}, so the end is $${start} + ${moves} \\times ${step} = ${start + moves * step}$, which is ${answer} modulo ${n}.`,
        `每个箭头加 ${step}，所以终点是 $${start} + ${moves} \\times ${step} = ${start + moves * step}$，模 ${n} 是 ${answer}。`,
      ),
      figure,
      "integer",
    );
  },
};

const dihedralFromPolygon: KnowledgePointDef = {
  id: "following-a-symmetry-of-a-polygon",
  title: t("Following a symmetry of a polygon", "跟踪多边形的对称变换"),
  explanation: t(
    "The dihedral group is made of the rotations and reflections of a regular polygon. To follow one, track a single vertex: a rotation moves every vertex the same number of steps round the polygon, and a reflection in the axis through vertex 1 sends vertex $k$ to the vertex the same number of steps the other way round. Working with numbers modulo $n$ keeps this exact.",
    "二面体群由正多边形的旋转和反射组成。要跟踪一个变换，就跟踪一个顶点：旋转把每个顶点沿多边形移动同样的步数，经过顶点 1 的轴的反射，把顶点 $k$ 送到反方向同样步数的顶点。用模 $n$ 的数来算，结果就很准确。",
  ),
  generate(rng) {
    const n = rng.int(4, 8);
    const at = ring(n, 80);
    const vertex = rng.int(1, n);
    const steps = rng.int(1, n - 1);
    const reflect = rng.bool();
    const wrap = (k: number) => ((k - 1 + 10 * n) % n) + 1;
    const rotated = wrap(vertex + steps);
    const reflected = wrap(2 - vertex);
    const answer = reflect ? reflected : rotated;
    const polygon = `<polygon class="accent" points="${at.map((p) => p.join(",")).join(" ")}"/>`;
    const labels = at.map(([x, y], i) => label(160 + (x - 160) * 1.22, 110 + (y - 110) * 1.22 + 4, `${i + 1}`)).join("");
    const axis = reflect ? `<line x1="160" y1="24" x2="160" y2="196" stroke-dasharray="4 3"/>` : "";
    return numeric(
      reflect
        ? t(
            `This regular ${n}-gon is reflected in the dashed line through vertex 1. To which position does vertex ${vertex} go?`,
            `这个正 ${n} 边形关于过顶点 1 的虚线作反射。顶点 ${vertex} 去到哪个位置？`,
          )
        : t(
            `This regular ${n}-gon is rotated clockwise by ${steps} ${steps === 1 ? "step" : "steps"}, where a step is the angle between neighboring vertices. To which position does vertex ${vertex} go?`,
            `这个正 ${n} 边形顺时针旋转 ${steps} 步，一步是相邻顶点之间的角。顶点 ${vertex} 去到哪个位置？`,
          ),
      answer,
      [reflect ? rotated : reflected, wrap(vertex - steps), vertex, wrap(answer + 1), wrap(answer - 1), wrap(answer + 2)],
      reflect
        ? t(
            `Vertex ${vertex} is ${vertex - 1} ${vertex === 2 ? "step" : "steps"} clockwise from vertex 1, so its image is the same distance counterclockwise, at position ${reflected}.`,
            `顶点 ${vertex} 从顶点 1 顺时针走 ${vertex - 1} 步，所以它的像在逆时针同样距离处，即位置 ${reflected}。`,
          )
        : t(
            `Numbers run clockwise, so the vertex moves up by ${steps}, wrapping around after ${n}: $${vertex} + ${steps}$ becomes ${rotated}.`,
            `数字按顺时针排列，所以顶点增加 ${steps}，过 ${n} 后回绕：$${vertex} + ${steps}$ 变成 ${rotated}。`,
          ),
      {
        svg: svgDocument(220, polygon + labels + axis),
        alt: t(
          `A regular ${n}-gon with vertices numbered clockwise from 1 at the top${reflect ? ", and a vertical dashed line through vertex 1" : ""}.`,
          `一个正 ${n} 边形，顶点从顶部的 1 开始顺时针编号${reflect ? "，还有一条过顶点 1 的竖直虚线" : ""}。`,
        ),
      },
      "integer",
    );
  },
};

const rootOrderFromCircle: KnowledgePointDef = {
  id: "the-order-of-a-root-of-unity-from-a-drawing",
  title: t("The order of a root of unity from a drawing", "由图读单位根的阶"),
  explanation: t(
    "The $n$-th roots of unity are evenly spaced on the unit circle, and they form a cyclic group under multiplication. Multiplying by a root turns the plane through its angle. So its order is the number of equal turns needed to come back to one, and this equals $n$ divided by the greatest common divisor of $n$ and the number of steps from one to the root.",
    "$n$ 次单位根均匀分布在单位圆上，在乘法下构成循环群。乘一个根就是把平面转过它的角。所以它的阶就是回到 1 需要转的次数，等于 $n$ 除以 $n$ 和从 1 到这个根的步数的最大公约数。",
  ),
  generate(rng) {
    const n = rng.pick([4, 5, 6, 8, 9, 10, 12]);
    const k = rng.int(1, n - 1);
    const order = n / gcd(n, k);
    const dots = Array.from(
      { length: n },
      (_, i): PlaneMark =>
        ({
          kind: "point",
          at: [2 * Math.cos((2 * Math.PI * i) / n), 2 * Math.sin((2 * Math.PI * i) / n)],
          ...(i === k ? { accent: true, label: "w", dir: Math.sin((2 * Math.PI * i) / n) >= 0 ? "n" : "s" } : { open: true }),
        }) as PlaneMark,
    );
    return numeric(
      t(
        `The dots are the ${n}th roots of unity, starting at 1 on the right. What is the order of the root $w$ in the group?`,
        `这些点是 ${n} 次单位根，从右边的 1 开始。根 $w$ 在群中的阶是多少？`,
      ),
      order,
      [n, k, n - k, gcd(n, k), order + 1, order + 2, order * 2],
      t(
        `$w$ is ${k} ${k === 1 ? "step" : "steps"} from 1, out of ${n}. So its order is $${n} \\div \\gcd(${n}, ${k}) = ${order}$.`,
        `$w$ 距 1 有 ${k} 步，一共 ${n} 步。所以它的阶是 $${n} \\div \\gcd(${n}, ${k}) = ${order}$。`,
      ),
      drawn(
        square(3),
        [{ kind: "circle", center: [0, 0], r: 2, dashed: true }, ...dots],
        t(
          `${n} dots evenly spaced on a circle, with w ${k} ${k === 1 ? "step" : "steps"} counterclockwise from the rightmost point.`,
          `圆上均匀分布 ${n} 个点，w 在最右边的点逆时针 ${k} 步处。`,
        ),
      ),
      "integer",
    );
  },
};

const permutationOrderFromArrows: KnowledgePointDef = {
  id: "the-order-of-a-permutation-from-an-arrow-diagram",
  title: t("The order of a permutation from arrows", "由箭头图读置换的阶"),
  explanation: t(
    "A permutation drawn with arrows falls apart into separate cycles, one for each closed loop of arrows. Each cycle returns to its start after a number of steps equal to its length. The whole permutation returns to the identity only when all cycles do at once, so its order is the least common multiple of the lengths, and not their sum.",
    "用箭头画出的置换，会分成若干个不相交的循环，每个闭合的箭头圈是一个循环。每个循环走过等于其长度的步数后回到起点。整个置换只有在所有循环同时回到起点时才回到恒等，所以它的阶是各长度的最小公倍数，而不是它们的和。",
  ),
  generate(rng) {
    const lengths = rng.pick([[2, 3], [3, 3], [2, 2, 2], [2, 4], [1, 5], [3, 2, 1], [6], [4, 1, 1], [5], [2, 2, 1], [4, 3], [2, 5]]);
    const n = lengths.reduce((a, b) => a + b, 0);
    const edges: [number, number][] = [];
    let first = 0;
    const order: number[] = rng.shuffle(Array.from({ length: n }, (_, i) => i));
    for (const len of lengths) {
      for (let i = 0; i < len; i++) edges.push([order[first + i] as number, order[first + ((i + 1) % len)] as number]);
      first += len;
    }
    const lcm = lengths.reduce((a, b) => (a * b) / gcd(a, b), 1);
    const sum = lengths.reduce((a, b) => a + b, 0);
    const names = Array.from({ length: n }, (_, i) => `${i + 1}`);
    return numeric(
      t(
        "Each arrow sends a number to its image under a permutation. What is the order of the permutation?",
        "每个箭头把一个数送到它在置换下的像。这个置换的阶是多少？",
      ),
      lcm,
      [sum, Math.max(...lengths), lengths.length, lcm + 1, lcm + 2, lcm * 2],
      lengths.length === 1
        ? t(`The arrows form one cycle, of length ${lcm}, so the order is ${lcm}.`, `箭头构成一个循环，长度为 ${lcm}，所以阶是 ${lcm}。`)
        : t(
            `The cycles have lengths ${lengths.join(", ")}, and their least common multiple is ${lcm}.`,
            `各循环的长度是 ${lengths.join("、")}，它们的最小公倍数是 ${lcm}。`,
          ),
      graphFigure(
        names,
        edges,
        true,
        t(
          `An arrow diagram on the numbers 1 to ${n}, with arrows ${edges.map(([a, b]) => `${a + 1} to ${b + 1}`).join(", ")}.`,
          `数字 1 到 ${n} 的箭头图，箭头为 ${edges.map(([a, b]) => `${a + 1} 到 ${b + 1}`).join("、")}。`,
        ),
      ),
      "integer",
    );
  },
};

// ---------------------------------------------------------------------------
// Discrete mathematics
// ---------------------------------------------------------------------------

const adjacencyFromGraph: KnowledgePointDef = {
  id: "an-entry-of-the-adjacency-matrix-from-a-drawing",
  title: t("Walk counts from a drawn graph", "由图数走法"),
  explanation: t(
    "The entry in row $i$ and column $j$ of the adjacency matrix counts the edges between those vertices, and the same entry of the matrix squared counts walks of length two. A walk of length two from $i$ to $j$ passes through some common neighbor, so counting those neighbors on a drawing gives the same number without any multiplication. This is why powers of the matrix count walks.",
    "邻接矩阵第 $i$ 行第 $j$ 列的元素是这两个顶点之间的边数，矩阵平方的同一元素是长度为 2 的走法数。从 $i$ 到 $j$ 长度为 2 的走法要经过一个公共邻点，所以在图上数这些邻点，不用做乘法就能得到同样的数。这就是矩阵的幂能计数走法的原因。",
  ),
  generate(rng) {
    const n = rng.int(5, 6);
    const names = ["A", "B", "C", "D", "E", "F"].slice(0, n);
    const edges: [number, number][] = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (rng.int(0, 99) < 55) edges.push([i, j]);
    const has = (a: number, b: number) => edges.some(([p, q]) => (p === a && q === b) || (p === b && q === a));
    const a = rng.int(0, n - 1);
    const b = rng.pick(Array.from({ length: n }, (_, i) => i).filter((i) => i !== a));
    const common = Array.from({ length: n }, (_, i) => i).filter((i) => has(a, i) && has(b, i));
    const degree = (v: number) => edges.filter(([p, q]) => p === v || q === v).length;
    const answer = common.length;
    return numeric(
      t(
        `How many walks of length 2 go from ${names[a]} to ${names[b]} in this graph?`,
        `这个图中从 ${names[a]} 到 ${names[b]} 长度为 2 的走法有多少种？`,
      ),
      answer,
      [degree(a), degree(b), answer + 1, answer + 2, answer + 3],
      t(
        answer === 0
          ? `${names[a]} and ${names[b]} have no common neighbor, so there are no such walks.`
          : `${common.length === 1 ? "The only common neighbor" : "The common neighbors"} of ${names[a]} and ${names[b]} ${common.length === 1 ? "is" : "are"} ${common.map((i) => names[i]).join(", ")}, and each gives one walk.`,
        answer === 0
          ? `${names[a]} 和 ${names[b]} 没有公共邻点，所以没有这样的走法。`
          : `${names[a]} 和 ${names[b]} 的公共邻点是 ${common.map((i) => names[i]).join("、")}，每个给出一种走法。`,
      ),
      graphFigure(
        names,
        edges,
        false,
        t(
          `A graph on ${names.join(", ")} with edges ${edges.map(([p, q]) => `${names[p]}${names[q]}`).join(", ") || "none"}.`,
          `顶点为 ${names.join("、")} 的图，边为 ${edges.map(([p, q]) => `${names[p]}${names[q]}`).join("、") || "无"}。`,
        ),
      ),
      "integer",
    );
  },
};

const edgesToTree: KnowledgePointDef = {
  id: "edges-to-remove-to-get-a-tree",
  title: t("Edges to remove to get a tree", "要去掉几条边才成树"),
  explanation: t(
    "A tree on $n$ vertices has exactly $n - 1$ edges, whichever tree it is. So a connected graph with more edges has extra ones that close cycles, and removing each of these while staying connected leaves a spanning tree. The number that must go is the number of edges minus the number of vertices plus one, and it does not depend on which edges are chosen.",
    "$n$ 个顶点的树恰好有 $n - 1$ 条边，不管是哪棵树。所以边更多的连通图有一些多余的边构成圈，逐条去掉它们并保持连通，就留下一棵生成树。必须去掉的边数等于边数减顶点数加 1，和选哪些边无关。",
  ),
  generate(rng) {
    const n = rng.int(5, 7);
    const names = ["A", "B", "C", "D", "E", "F", "G"].slice(0, n);
    const edges: [number, number][] = [];
    for (let i = 1; i < n; i++) edges.push([rng.int(0, i - 1), i]);
    const extra = rng.int(1, 4);
    const has = (a: number, b: number) => edges.some(([p, q]) => (p === a && q === b) || (p === b && q === a));
    for (let tries = 0, added = 0; tries < 50 && added < extra; tries++) {
      const a = rng.int(0, n - 1);
      const b = rng.int(0, n - 1);
      if (a !== b && !has(a, b)) {
        edges.push([a, b]);
        added++;
      }
    }
    const answer = edges.length - n + 1;
    return numeric(
      t(
        "What is the least number of edges to remove from this connected graph so that a tree is left, on the same vertices?",
        "这个连通图最少要去掉多少条边，才能在同样的顶点上留下一棵树？",
      ),
      answer,
      [edges.length - n, edges.length, n - 1, answer + 1],
      t(
        `The graph has ${n} vertices and ${edges.length} edges. A tree on ${n} vertices has ${n - 1} edges, so $${edges.length} - ${n - 1} = ${answer}$ must go.`,
        `这个图有 ${n} 个顶点、${edges.length} 条边。${n} 个顶点的树有 ${n - 1} 条边，所以要去掉 $${edges.length} - ${n - 1} = ${answer}$ 条。`,
      ),
      graphFigure(
        names,
        edges,
        false,
        t(
          `A connected graph on ${n} vertices with edges ${edges.map(([p, q]) => `${names[p]}${names[q]}`).join(", ")}.`,
          `${n} 个顶点的连通图，边为 ${edges.map(([p, q]) => `${names[p]}${names[q]}`).join("、")}。`,
        ),
      ),
      "integer",
    );
  },
};

/**
 * moreFigureReadingPoints holds, by topic id, further knowledge points that ask a learner to read a drawing. They reach the
 * courses that `figureReadingPoints` leaves almost without figures, such as Calculus II, Precalculus, Probability & Statistics,
 * Methods of Proof and Abstract Algebra, and come after a topic's own knowledge points.
 */
export const moreFigureReadingPoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "the-area-between-curves-expressed-as-functions-of-x": [areaSetupFromDrawing],
  "volumes-of-revolution-using-the-washer-method-rotation-about-the-coordinate-axes": [washerFromDrawing],
  "second-degree-taylor-polynomials": [taylorFromDrawing],
  "convergence-of-geometric-sequences": [sequenceFromPlot],
  "finding-the-limits-of-integration-for-a-given-polar-region": [petalLimits],
  "convergence-of-geometric-series": [seriesSumFromPlot],
  "foci-of-ellipses": [fociFromDrawing],
  "asymptotes-of-hyperbolas-centered-at-the-origin": [asymptotesFromDrawing],
  "arithmetic-in-the-complex-plane": [sumOnComplexPlane],
  "the-argument-of-a-complex-number": [argumentFromDrawing],
  "higher-roots-of-complex-numbers": [rootsOnCircle],
  "writing-sums-of-trigonometric-functions-in-amplitude-phase-form": [amplitudePhaseFromGraph],
  "rotation-scaling-matrices": [rotationScalingFromDrawing],
  "the-column-space-of-a-matrix": [columnSpaceFromLine],
  "linear-regression-with-matrices": [residualFromPlot],
  "analyzing-slope-fields-for-nonautonomous-differential-equations": [matchingSlopeField],
  "eulers-method-calculating-one-step": [eulerFromField],
  "qualitative-analysis-of-the-logistic-growth-equation": [logisticFromGraph],
  "the-unit-step-function": [stepFromGraph],
  "the-second-partial-derivatives-test": [criticalPointFromContours],
  "interpreting-line-integrals-of-vector-valued-functions": [workSignFromDrawing],
  "polar-coordinate-transformations": [polarFromPoint],
  "expected-values-of-discrete-random-variables": [expectedFromBars],
  "the-empirical-rule-for-the-normal-distribution": [empiricalFromCurve],
  "the-correlation-coefficient-for-two-random-variables": [correlationFromScatter],
  "the-law-of-total-probability": [totalFromTree],
  "bayes-theorem": [bayesFromTree],
  "de-morgans-laws-for-sets": [vennFromDrawing],
  bijections: [mapFromDrawing],
  "symmetric-and-antisymmetric-relations": [relationFromDigraph],
  "the-floor-and-ceiling-functions": [floorFromGraph],
  "visualizing-cartesian-products": [productFromDots],
  "cayley-tables": [cayleyReading],
  "cayley-diagrams": [cayleyDiagramWalk],
  "dihedral-group": [dihedralFromPolygon],
  "cyclic-subgroups-in-the-complex-plane": [rootOrderFromCircle],
  "the-order-of-a-permutation": [permutationOrderFromArrows],
  "adjacency-matrices": [adjacencyFromGraph],
  "trees-and-forests": [edgesToTree],
};
