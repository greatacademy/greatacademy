import type { Figure, Problem, Rng, Text, TopicDef } from "@ga/content";
import { t } from "@ga/content";
import { type Coefficient, dec, type Mark, type Point, poly, Q, sketch, solutionsChecker } from "@ga/subject-math";
import { geometryDrawings2 } from "../explanation-drawings-geometry-2.ts";
import { probabilityDrawings } from "../explanation-drawings-solids.ts";
import { choiceProblem, expressionProblem, numberProblem, steps, why, yesNo } from "../problems.ts";
import { stepLabel } from "../solution-kit.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const sorted = (xs: readonly number[]) => [...xs].sort((a, b) => a - b);
const unique = (xs: readonly number[]) => sorted([...new Set(xs)]);
const sum = (xs: readonly number[]) => xs.reduce((s, x) => s + x, 0);

/** range lists the integers from a to b inclusive. */
const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);

const toQ = (c: Coefficient): Q => (c instanceof Q ? c : Q.of(c));

/** setTex writes a set of numbers in LaTeX: "\{1, 3, 5\}", or "\varnothing" when it is empty. */
const setTex = (xs: readonly number[]) => (xs.length === 0 ? "\\varnothing" : `\\{${unique(xs).join(", ")}\\}`);

/** ratio writes the probability n/d, followed by its lowest terms when it reduces: "\frac{6}{20} = \frac{3}{10}". */
function ratio(n: number, d: number): string {
  const raw = `\\frac{${n}}{${d}}`;
  const v = Q.of(n, d);
  return v.toLatex() === raw ? raw : `${raw} = ${v.toLatex()}`;
}

/** plus writes a sum of counts with its total, "3 + 4 = 7", or the one count alone. */
const plus = (xs: readonly number[]) => (xs.length > 1 ? `${xs.join(" + ")} = ${sum(xs)}` : `${xs[0] ?? 0}`);

/** SetProblem describes a problem whose answer is a finite set of numbers. */
interface SetProblem {
  readonly prompt: Text;
  readonly values: readonly number[];
  readonly solution: Text;
  /** wrong are the sets typical mistakes produce; sets equal to the answer are dropped. */
  readonly wrong?: readonly (readonly number[])[];
}

/** setProblem builds a problem whose answer is a set of numbers, typed as a list such as "\{2, 4, 6\}" or "2, 4, 6", checked by the "solutions" checker. */
function setProblem(p: SetProblem): Problem {
  const expected = { var: "x", values: unique(p.values).map(String) };
  return {
    prompt: p.prompt,
    answer: { checker: "solutions", expected, input: { kind: "math" } },
    solution: p.solution,
    canonical: setTex(p.values),
    wrong: [...new Set((p.wrong ?? []).map(setTex))].filter((w) => !solutionsChecker.check(expected, w).correct),
  };
}

/** probProblem builds a problem whose answer is a probability, accepted as a fraction in lowest terms or a decimal. */
const probProblem = (prompt: Text, answer: Coefficient, solution: Text, wrong: readonly Coefficient[]) =>
  numberProblem({ prompt, answer, solution, wrong: wrong.filter((w) => toQ(w).sign() >= 0) });

/** piTex writes c·π in LaTeX: "\frac{9\pi}{64}", "\pi". */
function piTex(c: Q): string {
  const top = c.n === 1n ? "\\pi" : `${c.n}\\pi`;
  return c.d === 1n ? top : `\\frac{${top}}{${c.d}}`;
}

const SET_EN = " Write the set as a list, such as $\\{1, 2, 3\\}$, or type none if it is empty.";
const SET_ZH = "用列举法写出集合，如 $\\{1, 2, 3\\}$；若为空集，请输入 none。";

/** NumEvent is an event about a number drawn from 1 to n, such as "the number is even". */
interface NumEvent {
  readonly en: string;
  readonly zh: string;
  readonly test: (x: number) => boolean;
  /** loose is the test a typical mistake applies instead: the boundary included or excluded wrongly. */
  readonly loose: (x: number) => boolean;
  /** edge says how the rule treats its boundary, for a check. */
  readonly edge: Text;
}

/** numberEvent draws an event about a whole number from 1 to n (n ≥ 6). */
function numberEvent(rng: Rng, n: number): NumEvent {
  const kind = rng.pick(["even", "odd", "multiple", "greater", "less", "atLeast", "atMost", "factor"] as const);
  switch (kind) {
    case "even":
      return {
        en: "even",
        zh: "是偶数",
        test: (x) => x % 2 === 0,
        loose: (x) => x % 2 === 1,
        edge: t("the even numbers are every second number, starting from $2$", "偶数是从 $2$ 开始每隔一个取一个的数"),
      };
    case "odd":
      return {
        en: "odd",
        zh: "是奇数",
        test: (x) => x % 2 === 1,
        loose: (x) => x % 2 === 0,
        edge: t("the odd numbers are every second number, starting from $1$", "奇数是从 $1$ 开始每隔一个取一个的数"),
      };
    case "multiple": {
      const k = rng.int(3, Math.min(5, Math.floor(n / 2)));
      return {
        en: `a multiple of ${k}`,
        zh: `是 ${k} 的倍数`,
        test: (x) => x % k === 0,
        loose: (x) => k % x === 0,
        edge: t(
          `the multiples of $${k}$ are $${k}, ${2 * k}, ${3 * k}, \\ldots$, starting with $${k}$ itself`,
          `$${k}$ 的倍数是 $${k}, ${2 * k}, ${3 * k}, \\ldots$，从 $${k}$ 本身开始`,
        ),
      };
    }
    case "greater": {
      const m = rng.int(2, n - 2);
      return {
        en: `greater than ${m}`,
        zh: `大于 ${m}`,
        test: (x) => x > m,
        loose: (x) => x >= m,
        edge: t(`$${m}$ itself is not greater than $${m}$, so it is left out`, `$${m}$ 本身不大于 $${m}$，所以不算`),
      };
    }
    case "less": {
      const m = rng.int(3, n - 1);
      return {
        en: `less than ${m}`,
        zh: `小于 ${m}`,
        test: (x) => x < m,
        loose: (x) => x <= m,
        edge: t(`$${m}$ itself is not less than $${m}$, so it is left out`, `$${m}$ 本身不小于 $${m}$，所以不算`),
      };
    }
    case "atLeast": {
      const m = rng.int(3, n - 1);
      return {
        en: `at least ${m}`,
        zh: `不小于 ${m}`,
        test: (x) => x >= m,
        loose: (x) => x > m,
        edge: t(`$${m}$ itself is at least $${m}$, so it counts`, `$${m}$ 本身不小于 $${m}$，所以要算`),
      };
    }
    case "atMost": {
      const m = rng.int(2, n - 2);
      return {
        en: `at most ${m}`,
        zh: `不大于 ${m}`,
        test: (x) => x <= m,
        loose: (x) => x < m,
        edge: t(`$${m}$ itself is at most $${m}$, so it counts`, `$${m}$ 本身不大于 $${m}$，所以要算`),
      };
    }
    case "factor": {
      const f = rng.pick([12, 18, 20, 24, 30, 36].filter((v) => v <= 3 * n));
      return {
        en: `a factor of ${f}`,
        zh: `是 ${f} 的因数`,
        test: (x) => f % x === 0,
        loose: (x) => x % f === 0 || x === f,
        edge: t(
          `$1$ counts, since $1$ divides every number, and each factor $x$ has a partner $${f} \\div x$`,
          `$1$ 要算，因为 $1$ 整除任何数；每个因数 $x$ 都有搭档 $${f} \\div x$`,
        ),
      };
    }
  }
}

/** colors are the colors of marbles, spinner sections and the like. */
const colors = [
  ["red", "红"],
  ["blue", "蓝"],
  ["green", "绿"],
  ["yellow", "黄"],
  ["white", "白"],
] as const;

// ---------------------------------------------------------------------------
// Drawings
// ---------------------------------------------------------------------------

/** box lists the corners of the rectangle from (x0, y0) to (x1, y1), counterclockwise. */
const box = (x0: number, y0: number, x1: number, y1: number): Point[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];

/** ringPoints samples the circle of radius r about c. */
const ringPoints = (c: Point, r: number, n = 96): Point[] =>
  Array.from({ length: n }, (_, i): Point => [c[0] + r * Math.cos((2 * i * Math.PI) / n), c[1] + r * Math.sin((2 * i * Math.PI) / n)]);

/** ring draws a circle of radius r about c. */
const ring = (c: Point, r: number) => ({ kind: "polygon" as const, points: ringPoints(c, r) });

/** count writes a number centered at a point of a Venn diagram. */
const count = (at: Point, text: string): Mark => ({ kind: "label", at: [at[0], at[1] - 0.45], text, dir: "n" });

/** centered writes a label centered at a point of a sketch whose scale is s pixels to the unit. */
const centered = (at: Point, text: string, s: number): Mark => ({ kind: "label", at: [at[0], at[1] - 11 / s], text, dir: "n" });

/** scaleOf is the scale, in pixels to the unit, at which a sketch spanning w by h units is drawn. */
const scaleOf = (w: number, h: number) => Math.min(280 / (w || 1), 180 / (h || 1));

/** Circle is one circle of a Venn diagram. */
interface Circle {
  readonly c: Point;
  readonly r: number;
}

const inCircle = (p: Point, k: Circle) => Math.hypot(p[0] - k.c[0], p[1] - k.c[1]) < k.r;

/** arcsOf returns the runs of the boundary of circle i along which every other circle j's membership m(j) holds. */
function arcsOf(circles: readonly Circle[], i: number, m: (j: number, inside: boolean) => boolean): Point[][] {
  const k = circles[i]!;
  const points = ringPoints(k.c, k.r, 720);
  const ok = points.map((p) => circles.every((o, j) => j === i || m(j, inCircle(p, o))));
  if (ok.every(Boolean)) return [points];
  if (!ok.some(Boolean)) return [];
  const start = ok.indexOf(false);
  const runs: Point[][] = [];
  let run: Point[] | undefined;
  for (let s = 1; s <= points.length; s++) {
    const q = (start + s) % points.length;
    if (ok[q]) {
      if (!run) run = [];
      run.push(points[q]!);
    } else if (run) {
      runs.push(run);
      run = undefined;
    }
  }
  return runs;
}

/** loops joins arcs end to end into closed loops, each arc taken forward or backward. */
function loops(arcs: readonly Point[][]): Point[][] {
  const left = [...arcs];
  const out: Point[][] = [];
  const gap = (p: Point, q: Point) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  while (left.length > 0) {
    const loop = [...left.shift()!];
    for (;;) {
      const end = loop[loop.length - 1]!;
      let best = -1;
      let bestGap = Number.POSITIVE_INFINITY;
      let backward = false;
      left.forEach((a, i) => {
        const [g0, g1] = [gap(end, a[0]!), gap(end, a[a.length - 1]!)];
        if (g0 < bestGap) [best, bestGap, backward] = [i, g0, false];
        if (g1 < bestGap) [best, bestGap, backward] = [i, g1, true];
      });
      if (best < 0 || gap(end, loop[0]!) <= bestGap) break;
      const [a] = left.splice(best, 1);
      loop.push(...(backward ? [...a!].reverse() : a!));
    }
    out.push(loop);
  }
  return out;
}

/** regionShades shades the regions of a Venn diagram, inside the frame, whose memberships in the circles pass the test. */
function regionShades(frame: readonly Point[], circles: readonly Circle[], test: (m: readonly boolean[]) => boolean): Mark[] {
  const marks: Mark[] = [];
  for (let code = 0; code < 2 ** circles.length; code++) {
    const m = circles.map((_, i) => ((code >> i) & 1) === 1);
    if (!test(m)) continue;
    if (m.every((x) => !x)) {
      const outline = loops(circles.flatMap((_, i) => arcsOf(circles, i, (_j, inside) => !inside)));
      marks.push({ kind: "shade", points: frame, holes: outline });
    } else {
      const arcs = circles.flatMap((_, i) => arcsOf(circles, i, (j, inside) => inside === m[j]));
      for (const loop of loops(arcs)) marks.push({ kind: "shade", points: loop });
    }
  }
  return marks;
}

/** Venn2Layout places the frame, the two circles and the centers of the regions A only, both, B only and neither. */
interface Venn2Layout {
  readonly frame: Point[];
  readonly circles: readonly [Circle, Circle];
  readonly at: readonly [Point, Point, Point, Point];
}

const overlapping: Venn2Layout = {
  frame: box(-5.6, -3.4, 5.6, 3.4),
  circles: [
    { c: [-1.5, 0], r: 2.6 },
    { c: [1.5, 0], r: 2.6 },
  ],
  at: [
    [-2.5, 0],
    [0, 0],
    [2.5, 0],
    [4.7, -2.7],
  ],
};

/** venn2Marks draws the frame, circles and names of a two-set Venn diagram, with the regions passing shade shaded beneath. */
function venn2Marks(layout: Venn2Layout, shade?: (a: boolean, b: boolean) => boolean): Mark[] {
  const [ca, cb] = layout.circles;
  const top = Math.max(...layout.frame.map((p) => p[1]));
  const left = Math.min(...layout.frame.map((p) => p[0]));
  return [
    ...(shade ? regionShades(layout.frame, layout.circles, (m) => shade(m[0]!, m[1]!)) : []),
    { kind: "polygon", points: layout.frame },
    ring(ca.c, ca.r),
    ring(cb.c, cb.r),
    { kind: "label", at: [ca.c[0] - ca.r * 0.69, ca.c[1] + ca.r * 0.71], text: "A", dir: "nw", italic: true },
    { kind: "label", at: [cb.c[0] + cb.r * 0.69, cb.c[1] + cb.r * 0.71], text: "B", dir: "ne", italic: true },
    { kind: "label", at: [left, top], text: "U", dir: "se", italic: true },
  ];
}

/** venn2Svg draws the Venn diagram of two sets A and B in U with the given texts in the regions A only, both, B only and neither, and the regions passing shade shaded. */
function venn2Svg(texts: readonly string[], shade?: (a: boolean, b: boolean) => boolean): string {
  const marks = venn2Marks(overlapping, shade);
  texts.forEach((s, i) => {
    if (s) marks.push(count(overlapping.at[i]!, s));
  });
  return sketch(marks);
}

/** Venn2 are the counts of the regions A only, both, B only and neither. */
type Venn2 = readonly [number, number, number, number];

/** venn2Members are the memberships (in A, in B) of the regions of a Venn2. */
const venn2Members: readonly (readonly [boolean, boolean])[] = [
  [true, false],
  [true, true],
  [false, true],
  [false, false],
];

/** Shading names the regions shaded in a figure, for its description. */
interface Shading {
  readonly en: string;
  readonly zh: string;
  readonly test: (a: boolean, b: boolean) => boolean;
}

/** venn2Figure draws a two-set Venn diagram with counts, and the regions of an event shaded. */
function venn2Figure(c: Venn2, shade?: Shading): Figure {
  return {
    svg: venn2Svg(c.map(String), shade?.test),
    alt: t(
      `Venn diagram of A and B inside U: ${c[0]} in A only, ${c[1]} in both A and B, ${c[2]} in B only, ${c[3]} outside both.${shade ? ` Shaded: ${shade.en.replace(/\$/g, "")}.` : ""}`,
      `U 中 A 与 B 的韦恩图：仅在 A 中 ${c[0]}，同时在 A 和 B 中 ${c[1]}，仅在 B 中 ${c[2]}，两者之外 ${c[3]}。${shade ? `阴影部分：${shade.zh.replace(/\$/g, "")}。` : ""}`,
    ),
  };
}

/** venn2Counts draws the counts of a two-set Venn diagram. */
const venn2Counts = (rng: Rng): Venn2 => [rng.int(2, 24), rng.int(1, 15), rng.int(2, 24), rng.int(1, 16)];

/** lines splits a list of numbers into lines of at most per numbers each. */
function lines(xs: readonly number[], per: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < xs.length; i += per) out.push(xs.slice(i, i + per).join(", "));
  return out;
}

/** venn2Elements draws a Venn diagram with the elements of each region written in it: A only, both, B only and neither, and the regions passing shade shaded. Disjoint sets are drawn as circles apart. */
function venn2Elements(regions: readonly (readonly number[])[], shade?: (a: boolean, b: boolean) => boolean): string {
  const apart = regions[1]!.length === 0;
  const layout: Venn2Layout = apart
    ? {
        frame: box(-5.6, -4.7, 5.6, 3.4),
        circles: [
          { c: [-2.6, 0], r: 2.3 },
          { c: [2.6, 0], r: 2.3 },
        ],
        at: [
          [-2.6, 0],
          [0, 0],
          [2.6, 0],
          [0, -3.55],
        ],
      }
    : {
        ...overlapping,
        frame: box(-5.6, -4.7, 5.6, 3.4),
        at: [
          [-2.6, 0],
          [0, 0],
          [2.6, 0],
          [0, -3.55],
        ],
      };
  const marks = venn2Marks(layout, shade);
  regions.forEach((xs, i) => {
    const per = i === 3 ? 8 : i === 1 ? 2 : xs.length > 6 ? 3 : 2;
    const rows = lines(xs, per);
    const step = 0.62;
    rows.forEach((row, j) => {
      const [x, y] = layout.at[i]!;
      const dy = i === 3 ? -j * step : ((rows.length - 1) / 2 - j) * step;
      marks.push(count([x, y + dy], row));
    });
  });
  return sketch(marks);
}

/** regionsOf sorts the elements of U into the regions A only, both, B only and neither. */
const regionsOf = (u: readonly number[], a: readonly number[], b: readonly number[]) => [
  a.filter((x) => !b.includes(x)),
  a.filter((x) => b.includes(x)),
  b.filter((x) => !a.includes(x)),
  u.filter((x) => !a.includes(x) && !b.includes(x)),
];

/** Venn3 are the counts of the regions A only, A and B only, B only, A and C only, all three, B and C only, C only and none. */
type Venn3 = readonly [number, number, number, number, number, number, number, number];

/** venn3Members are the memberships (in A, in B, in C) of the regions of a Venn3. */
const venn3Members: readonly (readonly [boolean, boolean, boolean])[] = [
  [true, false, false],
  [true, true, false],
  [false, true, false],
  [true, false, true],
  [true, true, true],
  [false, true, true],
  [false, false, true],
  [false, false, false],
];

/** venn3Figure draws a three-set Venn diagram with counts, and the regions of an event shaded. */
function venn3Figure(
  c: Venn3,
  shade?: { readonly en: string; readonly zh: string; readonly test: (a: boolean, b: boolean, c: boolean) => boolean },
): Figure {
  const frame = box(-5.2, -4.4, 5.2, 4.3);
  const circles: Circle[] = [
    { c: [-1.3, 0.8], r: 2.4 },
    { c: [1.3, 0.8], r: 2.4 },
    { c: [0, -1.35], r: 2.4 },
  ];
  const marks: Mark[] = [
    ...(shade ? regionShades(frame, circles, (m) => shade.test(m[0]!, m[1]!, m[2]!)) : []),
    { kind: "polygon", points: frame },
    ...circles.map((k) => ring(k.c, k.r)),
    { kind: "label", at: [-3.0, 2.5], text: "A", dir: "nw", italic: true },
    { kind: "label", at: [3.0, 2.5], text: "B", dir: "ne", italic: true },
    { kind: "label", at: [1.7, -3.05], text: "C", dir: "se", italic: true },
    { kind: "label", at: [-5.2, 4.3], text: "U", dir: "se", italic: true },
  ];
  const at: Point[] = [
    [-2.2, 1.4],
    [0, 1.95],
    [2.2, 1.4],
    [-1.35, -0.55],
    [0, 0.25],
    [1.35, -0.55],
    [0, -2.55],
    [4.4, -3.7],
  ];
  c.forEach((s, i) => {
    marks.push(count(at[i]!, String(s)));
  });
  return {
    svg: sketch(marks),
    alt: t(
      `Venn diagram of A, B and C inside U: ${c[0]} in A only, ${c[2]} in B only, ${c[6]} in C only, ${c[1]} in A and B but not C, ${c[3]} in A and C but not B, ${c[5]} in B and C but not A, ${c[4]} in all three, ${c[7]} outside all three.${shade ? ` Shaded: ${shade.en.replace(/\$/g, "")}.` : ""}`,
      `U 中 A、B、C 的韦恩图：仅在 A 中 ${c[0]}，仅在 B 中 ${c[2]}，仅在 C 中 ${c[6]}，在 A 和 B 中但不在 C 中 ${c[1]}，在 A 和 C 中但不在 B 中 ${c[3]}，在 B 和 C 中但不在 A 中 ${c[5]}，三者都在 ${c[4]}，三者之外 ${c[7]}。${shade ? `阴影部分：${shade.zh.replace(/\$/g, "")}。` : ""}`,
    ),
  };
}

/** venn3Counts draws the counts of a three-set Venn diagram. */
const venn3Counts = (rng: Rng): Venn3 => [
  rng.int(2, 15),
  rng.int(1, 9),
  rng.int(2, 15),
  rng.int(1, 9),
  rng.int(1, 6),
  rng.int(1, 9),
  rng.int(2, 15),
  rng.int(1, 12),
];

/** StripRow is one row of numbered boxes: an optional name and the numbers shaded in it. */
interface StripRow {
  readonly name?: string;
  readonly has: (x: number) => boolean;
}

/** strips draws the numbers in rows of numbered boxes, ten to a line, once for each row, with the numbers each row has shaded. */
function strips(values: readonly number[], rows: readonly StripRow[]): string {
  const per = Math.min(10, values.length);
  const lineCount = Math.ceil(values.length / per);
  const named = rows.some((r) => r.name);
  const height = rows.length * lineCount * 1.1 + (rows.length - 1) * 0.5 - 0.1;
  const s = scaleOf(per * 1.1 - 0.1 + (named ? 1.6 : 0), height);
  const marks: Mark[] = [];
  let top = 0;
  for (const row of rows) {
    if (row.name)
      marks.push({ kind: "label", at: [-0.3, top - (lineCount * 1.1 - 0.1) / 2 - 11 / s], text: row.name, dir: "w", italic: true });
    values.forEach((x, i) => {
      const [x0, y0] = [(i % per) * 1.1, top - Math.floor(i / per) * 1.1];
      const sq = box(x0, y0 - 1, x0 + 1, y0);
      if (row.has(x)) marks.push({ kind: "shade", points: sq });
      marks.push({ kind: "polygon", points: sq });
      marks.push(centered([x0 + 0.5, y0 - 0.5], String(x), s));
    });
    top -= lineCount * 1.1 + 0.5;
  }
  return sketch(marks);
}

/** stripFigure draws the numbers with those of a set shaded. */
const stripFigure = (values: readonly number[], has: (x: number) => boolean, en: string, zh: string): Figure => ({
  svg: strips(values, [{ has }]),
  alt: t(en, zh),
});

/** diceGrid draws the 36 outcomes of two dice as a grid, the first die across and the second down, with a value in each cell and the cells of an event shaded. */
function diceGrid(value: (a: number, b: number) => number, has: (a: number, b: number) => boolean): string {
  const s = scaleOf(7, 7);
  const marks: Mark[] = [];
  for (const a of range(1, 6)) {
    for (const b of range(1, 6)) {
      const sq = box(a - 1, 6 - b, a, 7 - b);
      if (has(a, b)) marks.push({ kind: "shade", points: sq });
      marks.push({ kind: "polygon", points: sq });
      marks.push(centered([a - 0.5, 6.5 - b], String(value(a, b)), s));
    }
  }
  for (const k of range(1, 6)) {
    marks.push(centered([k - 0.5, 6.55], String(k), s));
    marks.push(centered([-0.55, 6.5 - k], String(k), s));
  }
  return sketch(marks);
}

/** dotGrid draws the outcomes of two experiments as rows × columns dots, one dot for each pair. */
function dotGrid(rows: number, columns: number): string {
  const marks: Mark[] = [{ kind: "polygon", points: box(-0.5, -rows + 0.5, columns - 0.5, 0.5) }];
  for (const i of range(0, rows - 1)) for (const j of range(0, columns - 1)) marks.push({ kind: "dot", at: [j, -i] });
  marks.push({ kind: "label", at: [(columns - 1) / 2, 0.5], text: String(columns), dir: "n" });
  marks.push({ kind: "label", at: [-0.5, -(rows - 1) / 2], text: String(rows), dir: "w" });
  return sketch(marks);
}

/** marbles draws a bag's marbles ten to a row, group by group, with the marbles of the marked groups shaded. */
function marbles(groups: readonly number[], marked: (i: number) => boolean): string {
  const marks: Mark[] = [];
  let k = 0;
  groups.forEach((g, i) => {
    for (let j = 0; j < g; j++, k++) {
      const c: Point = [k % 10, -Math.floor(k / 10)];
      if (marked(i)) marks.push({ kind: "shade", points: ringPoints(c, 0.38, 24) });
      marks.push({ kind: "polygon", points: ringPoints(c, 0.38, 24) });
    }
  });
  return sketch(marks);
}

/** spinner draws a spinner of n equal sections with the first k shaded. */
function spinner(n: number, k: number): string {
  const r = 3;
  const at = (i: number): Point => [r * Math.cos(Math.PI / 2 - (2 * Math.PI * i) / n), r * Math.sin(Math.PI / 2 - (2 * Math.PI * i) / n)];
  const marks: Mark[] = [];
  for (let i = 0; i < k; i++) {
    const arc = Array.from({ length: 13 }, (_, j) => {
      const a = Math.PI / 2 - (2 * Math.PI * (i + j / 12)) / n;
      return [r * Math.cos(a), r * Math.sin(a)] as Point;
    });
    marks.push({ kind: "shade", points: [[0, 0], ...arc] });
  }
  marks.push(ring([0, 0], r));
  for (let i = 0; i < n; i++) marks.push({ kind: "segment", a: [0, 0], b: at(i) });
  return sketch(marks);
}

/** partBar draws a bar standing for a whole, labeled above, with the share p of it shaded and labeled below. */
function partBar(whole: string, p: Q, part: string): string {
  const x = 10 * p.toNumber();
  return sketch([
    { kind: "shade", points: box(0, 0, x, 1) },
    { kind: "polygon", points: box(0, 0, 10, 1) },
    { kind: "segment", a: [x, 0], b: [x, 1] },
    { kind: "label", at: [5, 1], text: whole, dir: "n" },
    { kind: "label", at: [x / 2, 0], text: part, dir: "s" },
  ]);
}

/** scaleFigure draws the probability scale from 0 to 1 with a point at p, labeled with text. */
function probabilityScale(p: Q, text: string): string {
  const x = 10 * p.toNumber();
  return sketch([
    { kind: "segment", a: [0, 0], b: [10, 0] },
    ...[0, 5, 10].map((v): Mark => ({ kind: "segment", a: [v, -0.25], b: [v, 0.25] })),
    { kind: "label", at: [0, -0.25], text: "0", dir: "s" },
    { kind: "label", at: [5, -0.25], text: "1/2", dir: "s" },
    { kind: "label", at: [10, -0.25], text: "1", dir: "s" },
    { kind: "dot", at: [x, 0], tone: "result" },
    { kind: "label", at: [x, 0.2], text, dir: "n" },
  ]);
}

/** splitScale draws the interval from 0 to 1 split at p, the part for the event shaded and the rest left plain, each labeled above. */
function splitScale(p: Q, event: string, rest: string): string {
  const x = 10 * p.toNumber();
  return sketch([
    { kind: "shade", points: box(0, 0, x, 0.8) },
    { kind: "polygon", points: box(0, 0, 10, 0.8) },
    { kind: "segment", a: [x, 0], b: [x, 0.8] },
    { kind: "label", at: [x / 2, 0.8], text: event, dir: "n" },
    { kind: "label", at: [(x + 10) / 2, 0.8], text: rest, dir: "n" },
    { kind: "label", at: [0, 0], text: "0", dir: "s" },
    { kind: "label", at: [10, 0], text: "1", dir: "s" },
  ]);
}

/** Survey is the setting of a two-set Venn diagram: who was asked, and the two properties A and B, in the third person singular. */
interface Survey {
  readonly who: Text;
  readonly a: Text;
  readonly b: Text;
}

const surveys: readonly Survey[] = [
  { who: t("students", "学生"), a: t("plays soccer", "踢足球"), b: t("plays basketball", "打篮球") },
  { who: t("adults", "成年人"), a: t("owns a cat", "养猫"), b: t("owns a dog", "养狗") },
  { who: t("students", "学生"), a: t("studies French", "学法语"), b: t("studies Spanish", "学西班牙语") },
  { who: t("office workers", "上班族"), a: t("drinks coffee", "喝咖啡"), b: t("drinks tea", "喝茶") },
  { who: t("club members", "俱乐部会员"), a: t("swims", "游泳"), b: t("runs", "跑步") },
  { who: t("shoppers", "顾客"), a: t("bought fruit", "买了水果"), b: t("bought bread", "买了面包") },
];

/** surveyPrompt introduces a two-set Venn diagram with counts and the events A and B. */
function surveyPrompt(s: Survey, total: number): Text {
  return t(
    `In a survey of ${total} ${s.who.en}, $A$ is the event that a person ${s.a.en} and $B$ the event that the person ${s.b.en}. The Venn diagram shows how many people are in each region. One person is chosen at random.`,
    `调查了 ${total} 名${s.who["zh-CN"]}，事件 $A$ 表示此人${s.a["zh-CN"]}，事件 $B$ 表示此人${s.b["zh-CN"]}。韦恩图给出了每个区域的人数。从中随机选出一人。`,
  );
}

/** Survey3 is the setting of a three-set Venn diagram. */
interface Survey3 {
  readonly who: Text;
  readonly a: Text;
  readonly b: Text;
  readonly c: Text;
}

const surveys3: readonly Survey3[] = [
  { who: t("students", "学生"), a: t("takes art", "选修美术"), b: t("takes music", "选修音乐"), c: t("takes drama", "选修戏剧") },
  { who: t("guests", "客人"), a: t("ordered soup", "点了汤"), b: t("ordered salad", "点了沙拉"), c: t("ordered dessert", "点了甜点") },
  { who: t("teenagers", "青少年"), a: t("uses app A", "使用应用 A"), b: t("uses app B", "使用应用 B"), c: t("uses app C", "使用应用 C") },
  { who: t("runners", "跑者"), a: t("ran in spring", "春季参赛"), b: t("ran in summer", "夏季参赛"), c: t("ran in autumn", "秋季参赛") },
];

/** survey3Prompt introduces a three-set Venn diagram with counts and the events A, B and C. */
function survey3Prompt(s: Survey3, total: number): Text {
  return t(
    `In a survey of ${total} ${s.who.en}, $A$, $B$ and $C$ are the events that a person ${s.a.en}, ${s.b.en} and ${s.c.en}. The Venn diagram shows how many people are in each region. One person is chosen at random.`,
    `调查了 ${total} 名${s.who["zh-CN"]}，事件 $A$、$B$、$C$ 分别表示此人${s.a["zh-CN"]}、${s.b["zh-CN"]}、${s.c["zh-CN"]}。韦恩图给出了每个区域的人数。从中随机选出一人。`,
  );
}

/** VennEvent is an event built from A and B, with its LaTeX and a description of its regions. */
interface VennEvent {
  readonly tex: string;
  readonly en: string;
  readonly zh: string;
  readonly test: (a: boolean, b: boolean) => boolean;
}

/** vennCount counts the people of a two-set Venn diagram in an event. */
const vennCount = (c: Venn2, e: (a: boolean, b: boolean) => boolean) =>
  sum(c.filter((_, i) => e(venn2Members[i]![0], venn2Members[i]![1])));

/** vennParts lists the counts of the regions of a two-set Venn diagram in an event, in Venn2 order. */
const vennParts = (c: Venn2, e: (a: boolean, b: boolean) => boolean) => c.filter((_, i) => e(venn2Members[i]![0], venn2Members[i]![1]));

/**
 * vennSolution writes the solution of P(event) from a two-set Venn diagram: the event shaded on the diagram (its figure 0), its
 * regions added, divided by the total of all four regions, and the check that the rest of the diagram makes up the difference.
 */
function vennSolution(c: Venn2, e: VennEvent): Text {
  const parts = vennParts(c, e.test);
  const rest = vennParts(c, (a, b) => !e.test(a, b));
  const n = sum(parts);
  const total = sum(c);
  return t(
    `${stepLabel(1, "shade the event", "画出事件").en} $${e.tex}$ is ${e.en}:

{{figure 0}}

${stepLabel(2, "count and divide", "计数并相除").en} The shaded regions hold $${plus(parts)}$ people. Every person in $U$ is equally likely to be chosen, so divide by the total of all four regions, $${plus([...c])}$:${steps(`P(${e.tex}) = ${ratio(n, total)}`)}**Check.** The unshaded regions hold $${plus(rest)}$ people, and $${n} + ${sum(rest)} = ${total}$: together they make up everyone, so $P(${e.tex})$ and the probability of the rest add to $1$.`,
    `${stepLabel(1, "shade the event", "画出事件")["zh-CN"]}$${e.tex}$ 是${e.zh}：

{{figure 0}}

${stepLabel(2, "count and divide", "计数并相除")["zh-CN"]}阴影区域共有 $${plus(parts)}$ 人。$U$ 中每个人被选中的可能性相同，所以除以四个区域的总人数 $${plus([...c])}$：${steps(`P(${e.tex}) = ${ratio(n, total)}`)}**检验。** 没有阴影的区域有 $${plus(rest)}$ 人，$${n} + ${sum(rest)} = ${total}$：两部分合起来正好是所有人，所以 $P(${e.tex})$ 与其余部分的概率之和为 $1$。`,
  );
}

// ---------------------------------------------------------------------------
// 6.16 Introduction to Probability
// ---------------------------------------------------------------------------

/** DescribedSet is a set given by a rule, with the sets that typical mistakes produce and the texts that work it out. */
interface DescribedSet {
  readonly en: string;
  readonly zh: string;
  readonly elements: readonly number[];
  readonly loose: readonly (readonly number[])[];
  /** shown are the numbers to draw when the elements are picked out of them. */
  readonly shown: readonly number[];
  /** read says what the rule asks for, as the first step of a solution. */
  readonly read: Text;
  /** ends checks the list at its two ends, or by multiplying the factors back. */
  readonly ends: Text;
  /** tally counts the elements a second way: by a formula, or by the pairs of factors. */
  readonly tally: Text;
}

/** factorPairs lists the pairs (x, n ÷ x) of factors of n with x ≤ n ÷ x. */
const factorPairs = (n: number) => range(1, Math.floor(Math.sqrt(n))).flatMap((x) => (n % x === 0 ? [[x, n / x] as const] : []));

/** describedSet draws a set in set-builder notation: numbers of a kind between two bounds, or the factors of a number. */
function describedSet(rng: Rng, name: string): DescribedSet {
  if (rng.bool(0.2)) {
    const n = rng.pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50]);
    const fs = range(1, n).filter((x) => n % x === 0);
    const pairs = factorPairs(n);
    const products = pairs.map(([x, y]) => `${x} \\times ${y}`).join(", \\quad ");
    const square = pairs.some(([x, y]) => x === y);
    const root = Math.sqrt(n);
    return {
      en: `${name} = \\{x \\mid x \\text{ is a factor of } ${n}\\}`,
      zh: `${name} = \\{x \\mid x \\text{ 是 } ${n} \\text{ 的因数}\\}`,
      elements: fs,
      loose: [fs.filter((x) => x !== 1 && x !== n), fs.filter((x) => x !== n)],
      shown: range(1, n),
      read: t(
        `A factor of $${n}$ divides $${n}$ with no remainder. Factors come in pairs whose product is $${n}$, so try $1, 2, 3, \\ldots$ in turn. Once a trial passes $${Number.isInteger(root) ? root : `\\sqrt{${n}}`}$, its partner would be smaller than it and already found, so the pairs are complete:${steps(products)}`,
        `$${n}$ 的因数能整除 $${n}$，没有余数。因数成对出现，每对的积是 $${n}$，所以依次试 $1, 2, 3, \\ldots$。试到超过 $${Number.isInteger(root) ? root : `\\sqrt{${n}}`}$ 时，它的搭档会比它小，早已找到，所以所有的对就齐了：${steps(products)}`,
      ),
      ends: t(
        `**Check.** Every pair multiplies back to $${n}$, and both $1$ and $${n}$ itself are in the list: $1$ divides every number, and every number divides itself.`,
        `**检验。** 每一对相乘都得 $${n}$，并且 $1$ 和 $${n}$ 本身都在列表中：$1$ 整除任何数，任何数都整除它自己。`,
      ),
      tally: t(
        `**Check.** Count the factors by their pairs: there are $${pairs.length}$ pairs, so $2 \\times ${pairs.length} = ${2 * pairs.length}$ factors${square ? `, less one because the pair $${root} \\times ${root}$ repeats a number: $${2 * pairs.length} - 1 = ${fs.length}$` : ""}.`,
        `**检验。** 按对来数因数：共 $${pairs.length}$ 对，所以有 $2 \\times ${pairs.length} = ${2 * pairs.length}$ 个因数${square ? `，但 $${root} \\times ${root}$ 这一对的两个数相同，要减去 1：$${2 * pairs.length} - 1 = ${fs.length}$` : ""}。`,
      ),
    };
  }
  for (;;) {
    const k = rng.pick([0, 1, 2, 3, 4, 5, 6]);
    const lo = rng.int(1, 20);
    const hi = lo + rng.int(10, 32);
    const strictLo = rng.bool();
    const strictHi = rng.bool();
    const step = k <= 1 ? 2 : k + 1;
    const [what, whatZh, plural, pluralZh, p, upTo] =
      k === 0
        ? ["an odd number", "是奇数", "odd numbers", "奇数", (x: number) => x % 2 === 1, (x: number) => Math.floor((x + 1) / 2)]
        : k === 1
          ? ["an even number", "是偶数", "even numbers", "偶数", (x: number) => x % 2 === 0, (x: number) => Math.floor(x / 2)]
          : [
              `a multiple of ${k + 1}`,
              `是 ${k + 1} 的倍数`,
              `multiples of ${k + 1}`,
              `${k + 1} 的倍数`,
              (x: number) => x % (k + 1) === 0,
              (x: number) => Math.floor(x / (k + 1)),
            ];
    const within = (sl: boolean, sh: boolean) => range(lo, hi).filter((x) => p(x) && (sl ? x > lo : true) && (sh ? x < hi : true));
    const elements = within(strictLo, strictHi);
    if (elements.length < 3 || elements.length > 10) continue;
    // A bound that is not itself of the kind makes strict and non-strict the same; require one bound to matter.
    if (!p(lo) && !p(hi)) continue;
    const opLo = strictLo ? "<" : "\\le";
    const opHi = strictHi ? "<" : "\\le";
    const [first, last] = [elements[0]!, elements[elements.length - 1]!];
    const [before, after] = [first - step, last + step];
    const [min, max] = [strictLo ? lo + 1 : lo, strictHi ? hi - 1 : hi];
    const beforeText =
      before < lo
        ? t(`the ${what.replace(/^an? /, "")} before it, $${before}$, is below $${lo}$`, `它前面的${pluralZh} $${before}$ 小于 $${lo}$`)
        : t(`the one before it, $${lo}$, is left out by $<$`, `它前面的 $${lo}$ 被 $<$ 排除`);
    const afterText =
      after > hi
        ? t(`the one after $${last}$, $${after}$, is above $${hi}$`, `$${last}$ 后面的 $${after}$ 大于 $${hi}$`)
        : t(`the one after $${last}$, $${hi}$, is left out by $<$`, `$${last}$ 后面的 $${hi}$ 被 $<$ 排除`);
    const below = upTo(min - 1);
    return {
      en: `${name} = \\{x \\mid x \\text{ is ${what}}, ${lo} ${opLo} x ${opHi} ${hi}\\}`,
      zh: `${name} = \\{x \\mid x \\text{ ${whatZh}}, ${lo} ${opLo} x ${opHi} ${hi}\\}`,
      elements,
      loose: [within(false, false), within(true, true), within(!strictLo, !strictHi)],
      shown: range(lo, hi),
      read: t(
        `$x$ must be ${what}, between $${lo}$ and $${hi}$. The sign $${opLo}$ ${strictLo ? `leaves $${lo}$ out` : `keeps $${lo}$ in`}, and the sign $${opHi}$ ${strictHi ? `leaves $${hi}$ out` : `keeps $${hi}$ in`}.`,
        `$x$ 必须${whatZh}，并且在 $${lo}$ 与 $${hi}$ 之间。符号 $${opLo}$ ${strictLo ? `不含 $${lo}$` : `包含 $${lo}$`}，符号 $${opHi}$ ${strictHi ? `不含 $${hi}$` : `包含 $${hi}$`}。`,
      ),
      ends: t(
        `**Check.** Look at the ends: $${first}$ is the first of the ${plural} allowed, since ${beforeText.en}; and ${afterText.en}. In between, neighboring elements differ by $${step}$, so none was skipped.`,
        `**检验。** 看两端：$${first}$ 是允许的第一个${pluralZh}，因为${beforeText["zh-CN"]}；而${afterText["zh-CN"]}。中间相邻元素都相差 $${step}$，所以没有漏掉。`,
      ),
      tally: t(
        below === 0
          ? `**Check.** Count with a formula instead: from $1$ to $${max}$ there are $${upTo(max)}$ ${plural}, and none of them is below $${min}$, so there are $${upTo(max)}$.`
          : `**Check.** Count with a formula instead: from $1$ to $${max}$ there are $${upTo(max)}$ ${plural}, and from $1$ to $${min - 1}$ there are $${below}$, which are too small. That leaves $${upTo(max)} - ${below} = ${elements.length}$.`,
        below === 0
          ? `**检验。** 换用公式来数：从 $1$ 到 $${max}$ 共有 $${upTo(max)}$ 个${pluralZh}，其中没有小于 $${min}$ 的，所以共 $${upTo(max)}$ 个。`
          : `**检验。** 换用公式来数：从 $1$ 到 $${max}$ 共有 $${upTo(max)}$ 个${pluralZh}，从 $1$ 到 $${min - 1}$ 有 $${below}$ 个，它们太小。剩下 $${upTo(max)} - ${below} = ${elements.length}$ 个。`,
      ),
    };
  }
}

/** setsIntro draws the numbers 1 to 20 with the factors of 18 shaded. */
const setsIntro: Figure = stripFigure(
  range(1, 20),
  (x) => 18 % x === 0,
  "The numbers 1 to 20 with the factors of 18 shaded: 1, 2, 3, 6, 9 and 18.",
  "1 到 20 的数，其中 18 的因数涂上阴影：1、2、3、6、9、18。",
);

/** sets is outline topic 6.16.1. */
export const sets: TopicDef = {
  id: "sets",
  title: t("Sets", "集合"),
  summary: t(
    "Use set notation: elements, the number of elements, set-builder notation, and subsets.",
    "使用集合记号：元素、元素个数、描述法和子集。",
  ),
  prerequisites: ["factors-of-a-number", "multiples-of-a-number"],
  encompasses: [
    { topic: "factors-of-a-number", weight: 0.1 },
    { topic: "multiples-of-a-number", weight: 0.1 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.A.1"],
  intro: t(
    `You have listed the factors of a number before: the factors of $18$ are $1, 2, 3, 6, 9$ and $18$. Probability needs a precise way to talk about such collections, because an event, such as "the die shows an even number", is a collection of outcomes. A collection treated as one object is a **set**.

We write the factors of $18$ as a set by putting them between braces:

$$F = \\{1, 2, 3, 6, 9, 18\\}.$$

Each member is an **element** of the set: $6 \\in F$ says "$6$ is an element of $F$", and $4 \\notin F$ says "$4$ is not". Only membership matters, so $\\{18, 9, 6, 3, 2, 1\\}$ is the same set, and an element is never listed twice. Picked out of the numbers $1$ to $20$, the set looks like this:

{{figure 0}}

The set can also be given by its rule, $F = \\{x \\mid x \\text{ is a factor of } 18\\}$, read "the set of all $x$ such that $x$ is a factor of $18$". In this lesson we list a set from its rule, count its elements, and decide when one set lies inside another.`,
    `你以前列过一个数的因数：$18$ 的因数是 $1, 2, 3, 6, 9$ 和 $18$。概率需要一种精确的方式来谈论这样的一组对象，因为事件（例如“骰子掷出偶数”）就是一组结果。把一组对象看作一个整体，就是**集合**。

把 $18$ 的因数写在花括号里，就得到一个集合：

$$F = \\{1, 2, 3, 6, 9, 18\\}.$$

其中每个成员都是集合的**元素**：$6 \\in F$ 表示“$6$ 是 $F$ 的元素”，$4 \\notin F$ 表示“$4$ 不是”。集合只关心谁属于它，所以 $\\{18, 9, 6, 3, 2, 1\\}$ 是同一个集合，元素也不会重复写。从 $1$ 到 $20$ 的数中把它挑出来，就是这样：

{{figure 0}}

集合也可以用规则给出：$F = \\{x \\mid x \\text{ 是 } 18 \\text{ 的因数}\\}$，读作“所有满足 $x$ 是 $18$ 的因数的 $x$ 组成的集合”。这节课我们由规则列出集合，数出元素个数，并判断一个集合是否包含在另一个集合里。`,
  ),
  introFigures: [setsIntro],
  knowledgePoints: [
    {
      id: "listing-the-elements-of-a-set",
      title: t("Listing the elements of a set", "列举集合的元素"),
      explanation: t(
        `**Set-builder notation** describes a set by a rule: $\\{x \\mid \\text{condition}\\}$ is "the set of all $x$ such that the condition holds". To list the set, test the numbers one by one and keep those that pass. The bounds deserve the most care, because the two inequality signs decide them separately: $<$ leaves a bound out, $\\le$ keeps it in.

Take $B = \\{x \\mid x \\text{ is odd}, 3 \\le x < 11\\}$. The odd numbers near the range are $1, 3, 5, 7, 9, 11, 13$. The sign $3 \\le x$ keeps $3$, the sign $x < 11$ leaves $11$ out, so

$$B = \\{3, 5, 7, 9\\}.$$

A set with no elements at all is the **empty set**, written $\\varnothing$.

> **Watch out.** Read each sign on its own: $3 \\le x < 11$ keeps $3$ but drops $11$. Treating both signs as $\\le$ adds $11$, and treating both as $<$ loses $3$. For a set of factors, $1$ and the number itself are factors too.`,
        `**描述法**用规则描述集合：$\\{x \\mid \\text{条件}\\}$ 表示“所有满足条件的 $x$ 组成的集合”。要列出这个集合，就逐个检验各数，保留满足条件的数。最要小心的是端点，因为两个不等号分别决定两端：$<$ 不含端点，$\\le$ 含端点。

例如 $B = \\{x \\mid x \\text{ 是奇数}, 3 \\le x < 11\\}$。这一范围附近的奇数是 $1, 3, 5, 7, 9, 11, 13$。$3 \\le x$ 保留 $3$，$x < 11$ 去掉 $11$，所以

$$B = \\{3, 5, 7, 9\\}.$$

一个元素也没有的集合叫**空集**，记作 $\\varnothing$。

> **注意。** 两个符号要分别看：$3 \\le x < 11$ 含 $3$ 但不含 $11$。把两个符号都当成 $\\le$ 会多出 $11$，都当成 $<$ 会漏掉 $3$。对于因数组成的集合，$1$ 和这个数本身也是因数。`,
      ),
      generate(rng) {
        const s = describedSet(rng, "A");
        return {
          ...setProblem({
            prompt: t(`List the elements of $${s.en}$.${SET_EN}`, `用列举法写出 $${s.zh}$。${SET_ZH}`),
            values: s.elements,
            wrong: s.loose,
            solution: t(
              `${stepLabel(1, "read the rule", "读懂规则").en} ${s.read.en}

${stepLabel(2, "test the numbers", "逐个检验").en} Going through the numbers from $${s.shown[0]}$ to $${s.shown[s.shown.length - 1]}$, the ones that pass are shaded:

{{figure 0}}${steps(`A = ${setTex(s.elements)}`)}${s.ends.en}`,
              `${stepLabel(1, "read the rule", "读懂规则")["zh-CN"]}${s.read["zh-CN"]}

${stepLabel(2, "test the numbers", "逐个检验")["zh-CN"]}从 $${s.shown[0]}$ 到 $${s.shown[s.shown.length - 1]}$ 逐个检验，满足条件的数涂上阴影：

{{figure 0}}${steps(`A = ${setTex(s.elements)}`)}${s.ends["zh-CN"]}`,
            ),
          }),
          solutionFigures: [
            stripFigure(
              s.shown,
              (x) => s.elements.includes(x),
              `The numbers ${s.shown[0]} to ${s.shown[s.shown.length - 1]}, with the elements of A shaded: ${s.elements.join(", ")}.`,
              `${s.shown[0]} 到 ${s.shown[s.shown.length - 1]} 的数，A 的元素涂上阴影：${s.elements.join("、")}。`,
            ),
          ],
        };
      },
    },
    {
      id: "the-number-of-elements",
      title: t("The number of elements", "元素的个数"),
      explanation: t(
        `$n(A)$ is the **number of elements** of a set $A$. The safe way to find it is to list the set first and then count, since the list shows exactly which numbers are in.

For $A = \\{x \\mid x \\text{ is a multiple of } 5, 10 < x \\le 40\\}$, the sign $10 < x$ leaves $10$ out and $x \\le 40$ keeps $40$:

$$A = \\{15, 20, 25, 30, 35, 40\\}, \\qquad n(A) = 6.$$

A formula gives a second count. From $1$ to $40$ there are $40 \\div 5 = 8$ multiples of $5$; from $1$ to $10$ there are $2$, and those are too small. So $n(A) = 8 - 2 = 6$ again. The empty set has $n(\\varnothing) = 0$.

> **Watch out.** $n(A)$ counts elements; it is not the largest element, and not the distance from one bound to the other, $40 - 10 = 30$. Count each end only if its sign allows it: with $10 < x$, the $10$ does not count.`,
        `$n(A)$ 表示集合 $A$ 的**元素个数**。稳妥的做法是先列出集合再数，因为列表清楚地显示了哪些数在其中。

对于 $A = \\{x \\mid x \\text{ 是 } 5 \\text{ 的倍数}, 10 < x \\le 40\\}$，$10 < x$ 不含 $10$，$x \\le 40$ 含 $40$：

$$A = \\{15, 20, 25, 30, 35, 40\\}, \\qquad n(A) = 6.$$

用公式可以再数一遍。从 $1$ 到 $40$ 有 $40 \\div 5 = 8$ 个 $5$ 的倍数；从 $1$ 到 $10$ 有 $2$ 个，它们太小。所以 $n(A) = 8 - 2 = 6$，结果相同。空集的元素个数 $n(\\varnothing) = 0$。

> **注意。** $n(A)$ 数的是元素的个数，不是最大的元素，也不是两个端点之差 $40 - 10 = 30$。端点只有在符号允许时才算：$10 < x$ 时，$10$ 不算。`,
      ),
      generate(rng) {
        const s = describedSet(rng, "A");
        const n = s.elements.length;
        return {
          ...numberProblem({
            prompt: t(`Let $${s.en}$. Find $n(A)$.`, `设 $${s.zh}$。求 $n(A)$。`),
            answer: n,
            form: "integer",
            wrong: [...s.loose.map((l) => l.length), n + 1, n - 1],
            solution: t(
              `${stepLabel(1, "list the set", "列出集合").en} ${s.read.en}

{{figure 0}}${steps(`A = ${setTex(s.elements)}`)}${stepLabel(2, "count", "计数").en} The list has $${n}$ elements, so $n(A) = ${n}$.

${s.tally.en}`,
              `${stepLabel(1, "list the set", "列出集合")["zh-CN"]}${s.read["zh-CN"]}

{{figure 0}}${steps(`A = ${setTex(s.elements)}`)}${stepLabel(2, "count", "计数")["zh-CN"]}列表中有 $${n}$ 个元素，所以 $n(A) = ${n}$。

${s.tally["zh-CN"]}`,
            ),
          }),
          solutionFigures: [
            stripFigure(
              s.shown,
              (x) => s.elements.includes(x),
              `The numbers ${s.shown[0]} to ${s.shown[s.shown.length - 1]}, with the ${n} elements of A shaded.`,
              `${s.shown[0]} 到 ${s.shown[s.shown.length - 1]} 的数，A 的 ${n} 个元素涂上阴影。`,
            ),
          ],
        };
      },
    },
    {
      id: "subsets",
      title: t("Subsets", "子集"),
      explanation: t(
        `$B$ is a **subset** of $A$, written $B \\subseteq A$, when every element of $B$ is also an element of $A$. In a Venn diagram the circle of $B$ then has nothing outside $A$. So the test goes through the elements of $B$, one at a time, and looks for each in $A$: a single element of $B$ missing from $A$ is enough to make $B \\not\\subseteq A$.

For $A = \\{1, 3, 5, 7, 9\\}$: $\\{3, 9\\} \\subseteq A$, since $3$ and $9$ are both in $A$. But $\\{3, 4\\} \\not\\subseteq A$, because $4 \\notin A$, even though $3$ is in $A$. Every set is a subset of itself, and $\\varnothing$ is a subset of every set, since it has no element that could be missing.

> **Watch out.** Sharing some elements is not enough: every element of $B$ must be in $A$. And $B \\subseteq A$ asks about the elements of $B$, not of $A$, so $A$ may well have elements that $B$ lacks.`,
        `如果 $B$ 的每个元素都是 $A$ 的元素，就说 $B$ 是 $A$ 的**子集**，记作 $B \\subseteq A$。这时在韦恩图中，$B$ 的圆没有任何部分在 $A$ 之外。所以检验时逐个查看 $B$ 的元素，看它是否在 $A$ 中：只要 $B$ 有一个元素不在 $A$ 中，就有 $B \\not\\subseteq A$。

对于 $A = \\{1, 3, 5, 7, 9\\}$：$\\{3, 9\\} \\subseteq A$，因为 $3$ 和 $9$ 都在 $A$ 中。但 $\\{3, 4\\} \\not\\subseteq A$，因为 $4 \\notin A$，尽管 $3$ 在 $A$ 中。每个集合都是它自身的子集；$\\varnothing$ 是任何集合的子集，因为它没有可能缺失的元素。

> **注意。** 有一些公共元素还不够：$B$ 的**每个**元素都必须在 $A$ 中。另外，$B \\subseteq A$ 问的是 $B$ 的元素，而不是 $A$ 的元素，所以 $A$ 完全可以有 $B$ 没有的元素。`,
      ),
      generate(rng) {
        const a = unique(rng.sample(range(1, 30), rng.int(5, 8)));
        const subset = rng.bool();
        let b = rng.sample(a, rng.int(2, 4));
        let outsider = 0;
        if (!subset) {
          outsider = rng.pick(range(1, 30).filter((x) => !a.includes(x)));
          b = [...b.slice(1), outsider];
        }
        b = unique(b);
        const inA = b.filter((x) => a.includes(x));
        const regions = regionsOf(union(a, b), a, b);
        const marks = b.map((x) => `${x} ${a.includes(x) ? "\\in" : "\\notin"} A`).join(", \\quad ");
        return {
          ...choiceProblem({
            prompt: t(
              `Let $A = ${setTex(a)}$ and $B = ${setTex(b)}$. Is $B \\subseteq A$?`,
              `设 $A = ${setTex(a)}$，$B = ${setTex(b)}$。$B \\subseteq A$ 吗？`,
            ),
            options: yesNo,
            correct: subset ? 0 : 1,
            solution: t(
              `${stepLabel(1, "look for each element of B in A", "在 A 中逐个查找 B 的元素").en}${steps(marks)}${stepLabel(2, "decide", "下结论").en} ${
                subset
                  ? "Every element of $B$ is in $A$, so $B \\subseteq A$. In the Venn diagram the shaded part of $B$ outside $A$ is empty:"
                  : `$${outsider} \\in B$ but $${outsider} \\notin A$, so $B \\not\\subseteq A$. In the Venn diagram $${outsider}$ sits in the shaded part of $B$ outside $A$:`
              }

{{figure 0}}

**Check.** $B$ has $${b.length}$ elements and $${inA.length}$ of them are in $A$; a subset needs all $${b.length}$${subset ? ", and that holds" : ", so one missing is enough to fail"}.`,
              `${stepLabel(1, "look for each element of B in A", "在 A 中逐个查找 B 的元素")["zh-CN"]}${steps(marks)}${stepLabel(2, "decide", "下结论")["zh-CN"]}${
                subset
                  ? "$B$ 的每个元素都在 $A$ 中，所以 $B \\subseteq A$。在韦恩图中，$B$ 在 $A$ 之外的阴影部分是空的："
                  : `$${outsider} \\in B$ 但 $${outsider} \\notin A$，所以 $B \\not\\subseteq A$。在韦恩图中，$${outsider}$ 位于 $B$ 在 $A$ 之外的阴影部分：`
              }

{{figure 0}}

**检验。** $B$ 有 $${b.length}$ 个元素，其中 $${inA.length}$ 个在 $A$ 中；子集要求全部 $${b.length}$ 个都在${subset ? "，这一条成立" : "，所以缺一个就不是子集"}。`,
            ),
          }),
          solutionFigures: [
            {
              svg: venn2Elements(regions, (inA2, inB) => inB && !inA2),
              alt: t(
                `Venn diagram of A and B: ${regions[0]!.join(", ") || "nothing"} in A only, ${regions[1]!.join(", ")} in both, ${regions[2]!.join(", ") || "nothing"} in B only. The part of B outside A is shaded.`,
                `A 与 B 的韦恩图：仅在 A 中 ${regions[0]!.join("、") || "无"}，同时在两者中 ${regions[1]!.join("、")}，仅在 B 中 ${regions[2]!.join("、") || "无"}。B 在 A 之外的部分涂上阴影。`,
              ),
            },
          ],
        };
      },
    },
  ],
};

/** Trial is a repeated experiment with one outcome counted. */
interface Trial {
  readonly en: (n: number, k: number) => string;
  readonly zh: (n: number, k: number) => string;
  readonly event: Text;
}

const trials: readonly Trial[] = [
  {
    en: (n, k) => `A coin is flipped ${n} times and lands heads ${k} times.`,
    zh: (n, k) => `一枚硬币抛了 ${n} 次，其中 ${k} 次正面朝上。`,
    event: t("the coin lands heads", "硬币正面朝上"),
  },
  {
    en: (n, k) => `A basketball player takes ${n} free throws and makes ${k} of them.`,
    zh: (n, k) => `一名篮球运动员罚球 ${n} 次，投中 ${k} 次。`,
    event: t("the player makes a free throw", "罚球投中"),
  },
  {
    en: (n, k) => `A thumbtack is dropped ${n} times and lands point up ${k} times.`,
    zh: (n, k) => `一枚图钉掷了 ${n} 次，其中 ${k} 次钉尖朝上。`,
    event: t("the thumbtack lands point up", "图钉钉尖朝上"),
  },
  {
    en: (n, k) => `Of ${n} light bulbs tested, ${k} are defective.`,
    zh: (n, k) => `检测了 ${n} 个灯泡，其中 ${k} 个有缺陷。`,
    event: t("a bulb is defective", "灯泡有缺陷"),
  },
  {
    en: (n, k) => `A bus was observed on ${n} days and arrived late on ${k} of them.`,
    zh: (n, k) => `观察了一辆公交车 ${n} 天，其中 ${k} 天晚点。`,
    event: t("the bus is late", "公交车晚点"),
  },
];

/** shareFigure draws a bar for a number of trials with the share that went one way shaded. */
const shareFigure = (whole: number, part: Coefficient, en: string, zh: string): Figure => ({
  svg: partBar(
    String(whole),
    toQ(part).div(Q.of(whole)),
    toQ(part)
      .toLatex()
      .replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2"),
  ),
  alt: t(en, zh),
});

/** experimentalIntro draws 40 tosses of a paper cup, 26 of them on its side. */
const experimentalIntro: Figure = shareFigure(
  40,
  26,
  "A bar for 40 tosses of a paper cup, with the 26 that landed on the side shaded: a little under two thirds of the bar.",
  "代表纸杯抛 40 次的长条，侧面着地的 26 次涂上阴影：略少于长条的三分之二。",
);

/** experimentalProbability is outline topic 6.16.2. */
export const experimentalProbability: TopicDef = {
  id: "experimental-probability",
  title: t("Experimental Probability", "试验概率"),
  summary: t(
    "Estimate the probability of an outcome as its relative frequency in repeated trials.",
    "用重复试验中结果出现的频率估计其概率。",
  ),
  prerequisites: ["equivalent-fractions"],
  encompasses: [{ topic: "equivalent-fractions", weight: 0.1 }],
  xp: 10,
  standards: ["CCSS.7.SP.C.6"],
  intro: t(
    `A fraction says what part of a whole something is. Probability uses fractions to say how likely an outcome is. For a coin we can reason that heads is one of two equal sides, but some objects give no such reason. How often does a paper cup land on its side rather than on its top or bottom? Nothing about its shape says. The way to find out is to **experiment**: toss it many times and count.

Suppose the cup is tossed $40$ times and lands on its side $26$ times. The outcome happened in $26$ of the $40$ trials, the shaded part of the bar:

{{figure 0}}

That part of the whole is the **experimental probability**:

$$P(\\text{side}) \\approx \\frac{26}{40} = \\frac{13}{20} = 0.65.$$

It is only an estimate, written with $\\approx$: another $40$ tosses would give a slightly different count. In this lesson we find experimental probabilities from counts and from frequency tables, and see why more trials give a steadier estimate.`,
    `分数表示某样东西占整体的多少。概率用分数表示一个结果有多大可能出现。对于硬币，我们可以推理：正面是两个相同的面之一；但有些物体给不出这样的理由。一个纸杯落下时侧面着地，而不是杯口或杯底着地，有多常见？从形状看不出来。办法是**做试验**：抛很多次，数一数。

假设纸杯抛了 $40$ 次，侧面着地 $26$ 次。这个结果出现在 $40$ 次试验中的 $26$ 次，就是长条中的阴影部分：

{{figure 0}}

这部分占整体的比例就是**试验概率**：

$$P(\\text{侧面}) \\approx \\frac{26}{40} = \\frac{13}{20} = 0.65.$$

它只是一个估计，所以用 $\\approx$：再抛 $40$ 次，次数会略有不同。这节课我们由次数和频数表求试验概率，并看看为什么试验次数越多，估计越稳定。`,
  ),
  introFigures: [experimentalIntro],
  knowledgePoints: [
    {
      id: "relative-frequency",
      title: t("Relative frequency", "频率"),
      explanation: t(
        `When an experiment is repeated, the **experimental probability** (or **relative frequency**) of an outcome is the fraction of all the trials in which it happened:

$$P(\\text{outcome}) \\approx \\frac{\\text{number of times it happened}}{\\text{number of trials}}$$

The bottom is the whole, every trial; the top is the part that went the right way. A die rolled $50$ times shows a six $9$ times, so the experimental probability of a six is $\\frac{9}{50}$. The other $41$ rolls give $\\frac{41}{50}$ for "not a six", and the two add to $\\frac{50}{50} = 1$, since every roll is one or the other.

Write the fraction in lowest terms: $18$ sixes in $60$ rolls is $\\frac{18}{60} = \\frac{3}{10}$.

> **Watch out.** Divide by the number of **trials**, not by the number of times the outcome failed: $\\frac{9}{41}$ compares sixes with non-sixes and is not a probability of anything. And count the outcome asked about, not the other one: $\\frac{41}{50}$ is the probability of not getting a six.`,
        `把一个试验重复多次，某个结果的**试验概率**（也叫**频率**）是它出现的次数占全部试验次数的比例：

$$P(\\text{结果}) \\approx \\frac{\\text{出现次数}}{\\text{试验次数}}$$

分母是整体，即全部试验；分子是符合要求的那部分。掷骰子 $50$ 次，出现六点 $9$ 次，所以六点的试验概率是 $\\frac{9}{50}$。其余 $41$ 次给出“不是六点”的 $\\frac{41}{50}$，两者之和是 $\\frac{50}{50} = 1$，因为每次不是六点就是非六点。

分数要化成最简：$60$ 次中出现 $18$ 次六点，就是 $\\frac{18}{60} = \\frac{3}{10}$。

> **注意。** 分母是**试验次数**，而不是没有出现的次数：$\\frac{9}{41}$ 是六点与非六点次数之比，不是任何事件的概率。还要数题目问的那个结果，而不是另一个：$\\frac{41}{50}$ 是不出现六点的概率。`,
      ),
      generate(rng) {
        const tr = rng.pick(trials);
        const n = rng.pick([20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200]);
        const k = rng.int(1, n - 1);
        return {
          ...probProblem(
            t(
              `${tr.en(n, k)} What is the experimental probability that ${tr.event.en}?`,
              `${tr.zh(n, k)}${tr.event["zh-CN"]}的试验概率是多少？`,
            ),
            Q.of(k, n),
            t(
              `${stepLabel(1, "count", "计数").en} There were $${n}$ trials in all, and in $${k}$ of them ${tr.event.en}.

${stepLabel(2, "divide", "相除").en} The part that went this way over the whole:${steps(`P = ${ratio(k, n)}`)}{{figure 0}}

**Check.** In the other $${n} - ${k} = ${n - k}$ trials it did not happen, and $\\frac{${k}}{${n}} + \\frac{${n - k}}{${n}} = \\frac{${n}}{${n}} = 1$: the event and its opposite share all the trials. The answer lies between $0$ and $1$, ${2 * k > n ? "above" : 2 * k < n ? "below" : "at"} $\\frac{1}{2}$ because $${k}$ is ${2 * k > n ? "more than" : 2 * k < n ? "less than" : "exactly"} half of $${n}$.`,
              `${stepLabel(1, "count", "计数")["zh-CN"]}一共做了 $${n}$ 次试验，其中 $${k}$ 次${tr.event["zh-CN"]}。

${stepLabel(2, "divide", "相除")["zh-CN"]}用符合的部分除以整体：${steps(`P = ${ratio(k, n)}`)}{{figure 0}}

**检验。** 其余 $${n} - ${k} = ${n - k}$ 次没有发生，$\\frac{${k}}{${n}} + \\frac{${n - k}}{${n}} = \\frac{${n}}{${n}} = 1$：事件与它的反面分享了全部试验。答案在 $0$ 与 $1$ 之间，并且${2 * k > n ? "大于" : 2 * k < n ? "小于" : "等于"} $\\frac{1}{2}$，因为 $${k}$ ${2 * k > n ? "多于" : 2 * k < n ? "少于" : "正好是"} $${n}$ 的一半。`,
            ),
            [Q.of(n - k, n), Q.of(k, n - k), Q.of(k, 100)],
          ),
          solutionFigures: [
            shareFigure(
              n,
              k,
              `A bar for the ${n} trials with the ${k} in which ${tr.event.en} shaded.`,
              `代表 ${n} 次试验的长条，其中${tr.event["zh-CN"]}的 ${k} 次涂上阴影。`,
            ),
          ],
        };
      },
    },
    {
      id: "experimental-probability-from-a-table",
      title: t("Experimental probability from a table", "由频数表求试验概率"),
      explanation: t(
        `Results are often recorded in a **frequency table**, one count for each outcome. Every trial landed in exactly one column, so the number of trials is the **sum of all the frequencies**. If several outcomes count, their frequencies are added on top, since a trial that gave either of them counts once.

| Color | Red | Blue | Green |
| :--- | :--- | :--- | :--- |
| Frequency | $14$ | $9$ | $17$ |

There were $14 + 9 + 17 = 40$ spins. The experimental probability of blue is $\\frac{9}{40}$, and of red or green $\\frac{14 + 17}{40} = \\frac{31}{40}$. The two add to $\\frac{40}{40} = 1$, because every spin was blue or else red or green.

> **Watch out.** The bottom is the total number of spins, not the number of colors: three colors do not make each one $\\frac{1}{3}$ likely, since the spins themselves show which came up more. Nor is it the number of spins of the other colors.`,
        `试验结果常记录在**频数表**中，每个结果一个次数。每次试验恰好落在一列中，所以试验总次数是**所有频数之和**。如果几个结果都算，就把它们的频数加起来作分子，因为得到其中任何一个的试验都只算一次。

| 颜色 | 红 | 蓝 | 绿 |
| :--- | :--- | :--- | :--- |
| 频数 | $14$ | $9$ | $17$ |

共转了 $14 + 9 + 17 = 40$ 次。蓝色的试验概率是 $\\frac{9}{40}$，红色或绿色的试验概率是 $\\frac{14 + 17}{40} = \\frac{31}{40}$。两者之和是 $\\frac{40}{40} = 1$，因为每次不是蓝色，就是红色或绿色。

> **注意。** 分母是转动的总次数，而不是颜色的种数：有三种颜色，并不意味着每种的概率都是 $\\frac{1}{3}$，实际转动的结果会显示哪种出现得多。分母也不是其他颜色出现的次数。`,
      ),
      generate(rng) {
        const cs = rng.sample(colors, rng.int(3, 4));
        const f = cs.map(() => rng.int(3, 30));
        const total = sum(f);
        const two = rng.bool(0.4);
        const picked = two ? sorted(rng.sample(range(0, cs.length - 1), 2)) : [rng.int(0, cs.length - 1)];
        const k = sum(picked.map((i) => f[i]!));
        const others = f.filter((_, i) => !picked.includes(i));
        const name = (lang: 0 | 1) => picked.map((i) => cs[i]![lang]).join(lang === 0 ? " or " : "或");
        const table = (lang: 0 | 1, mark = false) =>
          `| ${lang === 0 ? "Color" : "颜色"} | ${cs.map((c) => c[lang]).join(" | ")} |\n| :--- |${cs.map(() => " :--- |").join("")}\n| ${lang === 0 ? "Frequency" : "频数"} | ${f.map((x, i) => (mark && picked.includes(i) ? `$\\boxed{${x}}$` : `$${x}$`)).join(" | ")} |`;
        return probProblem(
          t(
            `A spinner was spun many times with these results:\n\n${table(0)}\n\nWhat is the experimental probability that the spinner lands on ${name(0)}?`,
            `转动一个转盘多次，结果如下：\n\n${table(1)}\n\n转盘停在${name(1)}色的试验概率是多少？`,
          ),
          Q.of(k, total),
          t(
            `${stepLabel(1, "the number of spins", "转动总次数").en} Every spin is counted once in the table, so add all the frequencies:${steps(`${f.join(" + ")} = ${total}`)}${stepLabel(2, "the spins that count", "符合的次数").en} ${two ? `Both ${name(0)} count, so add their frequencies, boxed below` : `The frequency of ${name(0)} is boxed below`}: $${plus(picked.map((i) => f[i]!))}$ spins.

${table(0, true)}

${stepLabel(3, "divide", "相除").en}${steps(`P = ${ratio(k, total)}`)}**Check.** The other colors came up $${plus(others)}$ times, and $${k} + ${sum(others)} = ${total}$, the number of spins: each spin is counted once, either in the event or outside it.`,
            `${stepLabel(1, "the number of spins", "转动总次数")["zh-CN"]}每次转动在表中只记一次，所以把所有频数相加：${steps(`${f.join(" + ")} = ${total}`)}${stepLabel(2, "the spins that count", "符合的次数")["zh-CN"]}${two ? `${name(1)}色都算，把它们的频数（下表中加框的）相加` : `${name(1)}色的频数在下表中加了框`}：共 $${plus(picked.map((i) => f[i]!))}$ 次。

${table(1, true)}

${stepLabel(3, "divide", "相除")["zh-CN"]}${steps(`P = ${ratio(k, total)}`)}**检验。** 其他颜色出现了 $${plus(others)}$ 次，$${k} + ${sum(others)} = ${total}$，正是转动的总次数：每次转动只算一次，不在事件中就在事件外。`,
          ),
          [Q.of(k, total - k), Q.of(1, cs.length), Q.of(picked.length, cs.length), ...(two ? [Q.of(f[picked[0]!]!, total)] : [])],
        );
      },
    },
  ],
};

/** predictionIntro draws 200 seeds planted, of which three quarters are expected to sprout. */
const predictionIntro: Figure = shareFigure(
  200,
  150,
  "A bar for 200 seeds with three quarters of it, 150 seeds, shaded.",
  "代表 200 粒种子的长条，其中四分之三（150 粒）涂上阴影。",
);

/** usingExperimentalProbabilityToMakePredictions is outline topic 6.16.3. */
export const usingExperimentalProbabilityToMakePredictions: TopicDef = {
  id: "using-experimental-probability-to-make-predictions",
  title: t("Using Experimental Probability to Make Predictions", "用试验概率进行预测"),
  summary: t(
    "Predict how often an outcome will occur in future trials from its experimental probability.",
    "由试验概率预测结果在今后试验中出现的次数。",
  ),
  prerequisites: ["experimental-probability", "proportions", "percent-of-a-number"],
  encompasses: [
    { topic: "experimental-probability", weight: 0.5 },
    { topic: "proportions", weight: 0.3 },
    { topic: "percent-of-a-number", weight: 0.3 },
  ],
  xp: 10,
  standards: ["CCSS.7.SP.C.6"],
  intro: t(
    `An experimental probability tells what fraction of the trials went one way. If the conditions stay the same, we expect future trials to go that way in about the same fraction, and that turns the probability into a **prediction**.

A gardener plants $60$ seeds from a packet and $45$ sprout. The experimental probability that a seed sprouts is $\\frac{45}{60} = \\frac{3}{4}$. If she plants $200$ more seeds from the same packet, about three quarters of them should sprout:

{{figure 0}}

$$\\frac{3}{4} \\times 200 = 150.$$

The same answer comes from a proportion, since the new count should be in the same ratio to $200$ as $45$ is to $60$: $\\frac{x}{200} = \\frac{45}{60}$ gives $x = 150$. The prediction is an expected value, not a promise: the real count will be near $150$, not exactly on it. In this lesson we predict from earlier trials, from a random sample of a population, and from trials already under way.`,
    `试验概率说明了试验中有多大比例出现了某个结果。如果条件不变，我们预计今后的试验中大约也有同样比例出现这个结果，于是概率就变成了**预测**。

一位园丁从一包种子中种下 $60$ 粒，有 $45$ 粒发芽。一粒种子发芽的试验概率是 $\\frac{45}{60} = \\frac{3}{4}$。如果她再从同一包中种下 $200$ 粒，大约四分之三会发芽：

{{figure 0}}

$$\\frac{3}{4} \\times 200 = 150.$$

用比例也能得到同样的结果，因为新的数量与 $200$ 之比应等于 $45$ 与 $60$ 之比：由 $\\frac{x}{200} = \\frac{45}{60}$ 得 $x = 150$。预测是一个期望值，而不是保证：实际数量会接近 $150$，但不一定正好是。这节课我们由已有的试验、由总体的随机样本、由进行中的试验来做预测。`,
  ),
  introFigures: [predictionIntro],
  knowledgePoints: [
    {
      id: "predicting-from-trials",
      title: t("Predicting from earlier trials", "由已有试验预测"),
      explanation: t(
        `To predict how many times an outcome will happen in a number of future trials, take the same fraction of the new trials:

$$\\text{predicted count} = P(\\text{outcome}) \\times \\text{number of future trials}$$

A player made $18$ of $24$ shots, so her experimental probability is $\\frac{18}{24} = \\frac{3}{4}$. In $40$ shots she can expect to make about

$$\\frac{3}{4} \\times 40 = 30.$$

Simplifying the fraction first keeps the numbers small: three quarters of $40$ is $30$. As a check, the prediction is in the same ratio as the data: $\\frac{30}{40} = \\frac{3}{4} = \\frac{18}{24}$.

> **Watch out.** Multiply by the probability of the outcome asked about, not of the other one: $\\frac{1}{4} \\times 40 = 10$ is the number of misses. And the earlier count, $18$, is not the prediction: the new number of trials, $40$, changes it.`,
        `要预测某个结果在今后若干次试验中出现几次，就在新的试验中取同样的比例：

$$\\text{预测次数} = P(\\text{结果}) \\times \\text{今后的试验次数}$$

一名球员 $24$ 次投篮投中 $18$ 次，她的试验概率是 $\\frac{18}{24} = \\frac{3}{4}$。投 $40$ 次，预计投中约

$$\\frac{3}{4} \\times 40 = 30$$

次。先化简分数可以让数字变小：$40$ 的四分之三是 $30$。检验一下，预测与数据的比例相同：$\\frac{30}{40} = \\frac{3}{4} = \\frac{18}{24}$。

> **注意。** 要乘题目所问结果的概率，而不是另一个结果的：$\\frac{1}{4} \\times 40 = 10$ 是投不中的次数。已有的次数 $18$ 也不是预测：新的试验次数 $40$ 会改变结果。`,
      ),
      generate(rng) {
        const tr = rng.pick(trials);
        for (;;) {
          const n = rng.pick([20, 24, 25, 30, 40, 50, 60, 80, 100]);
          const k = rng.int(1, n - 1);
          const p = Q.of(k, n);
          const m = Number(p.d) * rng.int(2, 30);
          if (m === n || m > 2000) continue;
          const answer = p.mul(Q.of(m));
          return {
            ...numberProblem({
              prompt: t(
                `${tr.en(n, k)} Based on these results, in how many of the next ${m} trials would you expect that ${tr.event.en}?`,
                `${tr.zh(n, k)}根据这些结果，在接下来的 ${m} 次中，预计有多少次${tr.event["zh-CN"]}？`,
              ),
              answer,
              form: "integer",
              wrong: [Q.of(n - k, n).mul(Q.of(m)), k, Q.of(m - k), k + m - n],
              solution: t(
                `${stepLabel(1, "the experimental probability", "试验概率").en} In the trials so far, ${tr.event.en} $${k}$ times out of $${n}$:${steps(`P = ${ratio(k, n)}`)}${stepLabel(2, "the same share of the new trials", "在新试验中取同样比例").en} Expect that share of the next $${m}$ trials:${steps(`${p.toLatex()} \\times ${m} = ${answer.toLatex()}`)}{{figure 0}}

**Check.** The prediction should be in the same ratio as the data, $\\frac{${answer.toLatex()}}{${m}} = \\frac{${k}}{${n}}$. Cross-multiply: $${answer.toLatex()} \\times ${n} = ${answer.mul(Q.of(n)).toLatex()}$ and $${k} \\times ${m} = ${k * m}$, which agree.`,
                `${stepLabel(1, "the experimental probability", "试验概率")["zh-CN"]}在已有的 $${n}$ 次试验中，有 $${k}$ 次${tr.event["zh-CN"]}：${steps(`P = ${ratio(k, n)}`)}${stepLabel(2, "the same share of the new trials", "在新试验中取同样比例")["zh-CN"]}在接下来的 $${m}$ 次中预计占同样比例：${steps(`${p.toLatex()} \\times ${m} = ${answer.toLatex()}`)}{{figure 0}}

**检验。** 预测应与数据的比例相同：$\\frac{${answer.toLatex()}}{${m}} = \\frac{${k}}{${n}}$。交叉相乘：$${answer.toLatex()} \\times ${n} = ${answer.mul(Q.of(n)).toLatex()}$，$${k} \\times ${m} = ${k * m}$，两者相等。`,
              ),
            }),
            solutionFigures: [
              shareFigure(
                m,
                answer,
                `A bar for the next ${m} trials with the share ${p.toLatex().replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")} shaded: ${answer.toLatex()} trials.`,
                `代表接下来 ${m} 次试验的长条，其中 ${p.toLatex().replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")} 涂上阴影：${answer.toLatex()} 次。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "predicting-from-a-sample",
      title: t("Predicting from a sample", "由样本预测"),
      explanation: t(
        `A random **sample** stands for the whole population: if it is chosen at random, each kind of member turns up in it in about the same share as in the population. So the share found in the sample, given as a fraction or a percent, is multiplied by the **size of the population**.

In a random sample of $50$ students, $12$ walk to school. Of the $900$ students in the school, about

$$\\frac{12}{50} \\times 900 = 12 \\times 18 = 216$$

walk. If instead $8\\%$ of a sample are left-handed, about $0.08 \\times 900 = 72$ of the $900$ are. To check a percent, find $1\\%$ first: $1\\%$ of $900$ is $9$, and $8 \\times 9 = 72$.

> **Watch out.** Multiply by the population, not the sample: the $12$ walkers are already the answer for the sample of $50$, not for the school. And use the share of the group asked about: $88\\%$ of the sample are not left-handed.`,
        `随机**样本**代表整个总体：只要是随机抽取的，各类成员在样本中所占的比例就和在总体中差不多。所以把样本中的比例（分数或百分数）乘以**总体的数量**。

随机抽取 $50$ 名学生，其中 $12$ 名步行上学。全校 $900$ 名学生中，步行上学的约有

$$\\frac{12}{50} \\times 900 = 12 \\times 18 = 216$$

名。如果样本中 $8\\%$ 是左撇子，那么 $900$ 人中约有 $0.08 \\times 900 = 72$ 人是左撇子。检验百分数时，可以先求 $1\\%$：$900$ 的 $1\\%$ 是 $9$，$8 \\times 9 = 72$。

> **注意。** 要乘总体的数量，而不是样本的数量：$12$ 名步行者只是 $50$ 人样本中的结果，不是全校的结果。还要用题目所问那一组的比例：样本中 $88\\%$ 不是左撇子。`,
      ),
      generate(rng) {
        const [en, zh, popEn, popZh] = rng.pick([
          ["prefer online classes", "更喜欢网课", "students in the district", "该区的学生"],
          ["have a library card", "有借书证", "residents of the town", "镇上的居民"],
          ["ride a bike to work", "骑车上班", "employees of the company", "公司的员工"],
          ["have been to the beach this year", "今年去过海滩", "people in the city", "城里的人"],
        ] as const);
        if (rng.bool()) {
          const pct = rng.pick([2, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 35, 40, 45, 60, 75]);
          const pop = rng.pick([200, 300, 400, 500, 600, 800, 1200, 1500, 2000, 2500, 4000]);
          const answer = Q.of(pct * pop, 100);
          const one = Q.of(pop, 100);
          return {
            ...numberProblem({
              prompt: t(
                `In a random sample, $${pct}\\%$ of the people asked ${en}. Predict how many of the ${pop} ${popEn} ${en}.`,
                `随机抽样调查中，$${pct}\\%$ 的受访者${zh}。预测 ${pop} 名${popZh}中有多少人${zh}。`,
              ),
              answer,
              form: "integer",
              wrong: [Q.of(pop * (100 - pct), 100), pct, Q.of(pop, pct)],
              solution: t(
                `${stepLabel(1, "the share as a decimal", "把比例写成小数").en} A random sample shows the population in miniature, so about $${pct}\\%$ of all ${pop} ${popEn} ${en}. As a decimal, $${pct}\\% = ${dec(Q.of(pct, 100))}$.

${stepLabel(2, "apply it to the population", "用于总体").en}${steps(`${dec(Q.of(pct, 100))} \\times ${pop} = ${answer.toLatex()}`)}{{figure 0}}

**Check.** Go through $1\\%$: $1\\%$ of $${pop}$ is $${dec(one)}$, and $${pct} \\times ${dec(one)} = ${answer.toLatex()}$.`,
                `${stepLabel(1, "the share as a decimal", "把比例写成小数")["zh-CN"]}随机样本是总体的缩影，所以全部 ${pop} 名${popZh}中约 $${pct}\\%$ ${zh}。写成小数，$${pct}\\% = ${dec(Q.of(pct, 100))}$。

${stepLabel(2, "apply it to the population", "用于总体")["zh-CN"]}${steps(`${dec(Q.of(pct, 100))} \\times ${pop} = ${answer.toLatex()}`)}{{figure 0}}

**检验。** 先求 $1\\%$：$${pop}$ 的 $1\\%$ 是 $${dec(one)}$，$${pct} \\times ${dec(one)} = ${answer.toLatex()}$。`,
              ),
            }),
            solutionFigures: [
              shareFigure(
                pop,
                answer,
                `A bar for the ${pop} ${popEn} with ${pct}% of it, ${answer.toLatex()} people, shaded.`,
                `代表 ${pop} 名${popZh}的长条，其中 ${pct}%（${answer.toLatex()} 人）涂上阴影。`,
              ),
            ],
          };
        }
        for (;;) {
          const n = rng.pick([20, 25, 30, 40, 50, 60, 80]);
          const k = rng.int(2, n - 2);
          const p = Q.of(k, n);
          const pop = Number(p.d) * rng.int(5, 60);
          if (pop <= n) continue;
          const answer = p.mul(Q.of(pop));
          return {
            ...numberProblem({
              prompt: t(
                `In a random sample of ${n} ${popEn}, ${k} ${en}. Predict how many of all ${pop} ${popEn} ${en}.`,
                `随机抽取 ${n} 名${popZh}，其中 ${k} 人${zh}。预测全部 ${pop} 名${popZh}中有多少人${zh}。`,
              ),
              answer,
              form: "integer",
              wrong: [Q.of(n - k, n).mul(Q.of(pop)), k, pop - n + k],
              solution: t(
                `${stepLabel(1, "the share in the sample", "样本中的比例").en} $${k}$ of the $${n}$ people sampled ${en}:${steps(`P = ${ratio(k, n)}`)}${stepLabel(2, "apply it to the population", "用于总体").en} A random sample shows the population in miniature, so take the same share of all $${pop}$:${steps(`${p.toLatex()} \\times ${pop} = ${answer.toLatex()}`)}{{figure 0}}

**Check.** The prediction should be in the same ratio as the sample, $\\frac{${answer.toLatex()}}{${pop}} = \\frac{${k}}{${n}}$. Cross-multiply: $${answer.toLatex()} \\times ${n} = ${answer.mul(Q.of(n)).toLatex()}$ and $${k} \\times ${pop} = ${k * pop}$, which agree.`,
                `${stepLabel(1, "the share in the sample", "样本中的比例")["zh-CN"]}抽样的 $${n}$ 人中有 $${k}$ 人${zh}：${steps(`P = ${ratio(k, n)}`)}${stepLabel(2, "apply it to the population", "用于总体")["zh-CN"]}随机样本是总体的缩影，所以在全部 $${pop}$ 人中取同样比例：${steps(`${p.toLatex()} \\times ${pop} = ${answer.toLatex()}`)}{{figure 0}}

**检验。** 预测应与样本的比例相同：$\\frac{${answer.toLatex()}}{${pop}} = \\frac{${k}}{${n}}$。交叉相乘：$${answer.toLatex()} \\times ${n} = ${answer.mul(Q.of(n)).toLatex()}$，$${k} \\times ${pop} = ${k * pop}$，两者相等。`,
              ),
            }),
            solutionFigures: [
              shareFigure(
                pop,
                answer,
                `A bar for all ${pop} ${popEn} with the sample's share, ${answer.toLatex()} people, shaded.`,
                `代表全部 ${pop} 名${popZh}的长条，按样本比例的 ${answer.toLatex()} 人涂上阴影。`,
              ),
            ],
          };
        }
      },
    },
  ],
};

/** Experiment is a simple experiment with equally likely outcomes. */
interface Experiment {
  readonly en: string;
  readonly zh: string;
  readonly size: number;
}

const experiments: readonly Experiment[] = [
  { en: "flipping a coin", zh: "抛一枚硬币", size: 2 },
  { en: "rolling a six-sided die", zh: "掷一枚六面骰子", size: 6 },
  { en: "spinning a spinner with 3 equal sections", zh: "转动一个有 3 个相等扇区的转盘", size: 3 },
  { en: "spinning a spinner with 4 equal sections", zh: "转动一个有 4 个相等扇区的转盘", size: 4 },
  { en: "spinning a spinner with 5 equal sections", zh: "转动一个有 5 个相等扇区的转盘", size: 5 },
  { en: "rolling an eight-sided die", zh: "掷一枚八面骰子", size: 8 },
  { en: "choosing a day of the week", zh: "选一周中的一天", size: 7 },
  { en: "choosing one of the letters A, B and C", zh: "从字母 A、B、C 中选一个", size: 3 },
];

/** diceSum counts the outcomes of two six-sided dice with sum s. */
const diceSum = (s: number) => Math.max(0, 6 - Math.abs(s - 7));

/** diceFigure draws the 36 outcomes of two dice with a value in each cell and the cells of an event shaded. */
const diceFigure = (value: (a: number, b: number) => number, has: (a: number, b: number) => boolean, en: string, zh: string): Figure => ({
  svg: diceGrid(value, has),
  alt: t(
    `A 6 by 6 grid of the outcomes of two dice, the first die across and the second down, each cell showing ${en}.`,
    `两枚骰子结果的 6 × 6 方格，第一枚横排，第二枚竖排，每格写着${zh}。`,
  ),
});

/** sumCounts writes the number of pairs giving each sum by the formula 6 − |s − 7|. */
const sumCounts = (sums: readonly number[]) => sums.map((v) => `${v}: ${diceSum(v)}`).join(", \\quad ");

/** sampleSpaceIntro draws the outcomes 1 to 8 of an eight-sided die with the even ones shaded. */
const sampleSpaceIntro: Figure = stripFigure(
  range(1, 8),
  (x) => x % 2 === 0,
  "The outcomes 1 to 8 of an eight-sided die, with the even ones shaded: 2, 4, 6 and 8.",
  "八面骰子的结果 1 到 8，其中偶数涂上阴影：2、4、6、8。",
);

/** sampleSpacesAndEventsInProbability is outline topic 6.16.4. */
export const sampleSpacesAndEventsInProbability: TopicDef = {
  id: "sample-spaces-and-events-in-probability",
  title: t("Sample Spaces and Events in Probability", "样本空间与事件"),
  summary: t(
    "Describe the sample space of an experiment, list the outcomes of an event, and count outcomes of combined experiments.",
    "描述试验的样本空间，列出事件包含的结果，并计算组合试验的结果数。",
  ),
  prerequisites: ["sets"],
  encompasses: [{ topic: "sets", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.7.SP.C.8.B", "CCSS.HSS.CP.A.1"],
  intro: t(
    `A set collects objects into one whole, and a subset picks some of them out. Probability uses exactly these two ideas. Before asking how likely something is, we must know **everything that could happen**, and then **which of those outcomes** make the thing we care about happen.

Roll an eight-sided die. Everything that could happen is the set of its faces,

$$S = \\{1, 2, 3, 4, 5, 6, 7, 8\\},$$

the **sample space**. "The number is even" happens for four of these outcomes, shaded here:

{{figure 0}}

So the event "even" is the subset $E = \\{2, 4, 6, 8\\}$ of $S$. Once the sample space and the event are written as sets, a probability becomes a matter of counting. In this lesson we list events, and we count the outcomes of experiments done together, such as two dice rolled at once.`,
    `集合把一些对象合成一个整体，子集从中挑出一部分。概率正好用到这两个想法。在问某件事有多大可能之前，我们必须知道**所有可能发生的结果**，再知道**其中哪些结果**会让我们关心的事情发生。

掷一枚八面骰子。所有可能的结果就是它各面组成的集合

$$S = \\{1, 2, 3, 4, 5, 6, 7, 8\\},$$

叫做**样本空间**。“点数是偶数”在其中四个结果时发生，下面涂上了阴影：

{{figure 0}}

所以事件“偶数”就是 $S$ 的子集 $E = \\{2, 4, 6, 8\\}$。把样本空间和事件都写成集合以后，求概率就变成了计数。这节课我们列出事件，并计算几个试验一起做时（例如同时掷两枚骰子）的结果数。`,
  ),
  introFigures: [sampleSpaceIntro],
  knowledgePoints: [
    {
      id: "listing-an-event",
      title: t("Listing the outcomes of an event", "列出事件的结果"),
      explanation: t(
        `The **sample space** $S$ of an experiment is the set of all its possible outcomes. An **event** is a subset of the sample space: the outcomes for which something happens. To list an event, go through the sample space one outcome at a time and keep those that make the event happen.

Rolling a die has $S = \\{1, 2, 3, 4, 5, 6\\}$. The event "the number is greater than $4$" is $\\{5, 6\\}$, since $4$ itself is not greater than $4$. The event "the number is at most $2$" is $\\{1, 2\\}$, since "at most" allows $2$ itself.

> **Watch out.** Words such as "greater than" and "less than" leave the boundary number out, while "at least" and "at most" keep it in. And list the outcomes **in** the event, not the ones outside it.`,
        `试验所有可能结果组成的集合叫**样本空间** $S$。**事件**是样本空间的子集：使某件事发生的那些结果。要列出一个事件，就逐个查看样本空间中的结果，保留使事件发生的那些。

掷一枚骰子，$S = \\{1, 2, 3, 4, 5, 6\\}$。事件“点数大于 $4$”是 $\\{5, 6\\}$，因为 $4$ 本身不大于 $4$。事件“点数不大于 $2$”是 $\\{1, 2\\}$，因为“不大于”允许 $2$ 本身。

> **注意。** “大于”“小于”不包含分界的那个数，“不小于”“不大于”则包含它。还要列出**属于**事件的结果，而不是事件之外的结果。`,
      ),
      generate(rng) {
        const n = rng.pick([6, 8, 10, 12, 15, 20]);
        for (;;) {
          const e = numberEvent(rng, n);
          const s = range(1, n);
          const ev = s.filter(e.test);
          if (ev.length === 0 || ev.length === n) continue;
          const what =
            n === 6
              ? t("A six-sided die is rolled", "掷一枚六面骰子")
              : t(`A card is drawn from ${n} cards numbered 1 to ${n}`, `从编号 1 到 ${n} 的 ${n} 张卡片中抽一张`);
          return {
            ...setProblem({
              prompt: t(
                `${what.en}. List the outcomes in the event that the number is ${e.en}.${SET_EN}`,
                `${what["zh-CN"]}。列出事件“这个数${e.zh}”包含的结果。${SET_ZH}`,
              ),
              values: ev,
              wrong: [s.filter(e.loose), s.filter((x) => !e.test(x))],
              solution: t(
                `${stepLabel(1, "the sample space", "样本空间").en} Every number from $1$ to $${n}$ can come up:${steps(`S = \\{1, 2, \\ldots, ${n}\\}`)}${stepLabel(2, "keep the outcomes in the event", "保留事件中的结果").en} Test each outcome: is it ${e.en}? Those that are, shaded below, make up the event.

{{figure 0}}${steps(setTex(ev))}**Check.** At the boundary: ${e.edge.en}. The other $${n - ev.length}$ outcomes are not ${e.en}, and $${ev.length} + ${n - ev.length} = ${n}$, the whole sample space.`,
                `${stepLabel(1, "the sample space", "样本空间")["zh-CN"]}$1$ 到 $${n}$ 的每个数都可能出现：${steps(`S = \\{1, 2, \\ldots, ${n}\\}`)}${stepLabel(2, "keep the outcomes in the event", "保留事件中的结果")["zh-CN"]}逐个检验：这个结果${e.zh}吗？满足的结果（下图阴影）组成这个事件。

{{figure 0}}${steps(setTex(ev))}**检验。** 看分界处：${e.edge["zh-CN"]}。其余 $${n - ev.length}$ 个结果不满足，$${ev.length} + ${n - ev.length} = ${n}$，正好是整个样本空间。`,
              ),
            }),
            solutionFigures: [
              stripFigure(
                s,
                e.test,
                `The outcomes 1 to ${n}, with those that are ${e.en} shaded: ${ev.join(", ")}.`,
                `结果 1 到 ${n}，其中${e.zh}的涂上阴影：${ev.join("、")}。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "counting-outcomes-of-combined-experiments",
      title: t("Counting outcomes of combined experiments", "组合试验的结果数"),
      explanation: t(
        `When two experiments are done together, an outcome is a pair: one result of the first and one of the second. Each outcome of the first can go with **every** outcome of the second, so the pairs fill a grid, one row for each outcome of the first and one column for each of the second. The number of pairs is rows times columns: the sizes of the sample spaces **multiply**.

Flipping a coin and rolling a die gives a grid of $2$ rows and $6$ columns:

{{figure 0}}

That is $2 \\times 6 = 12$ outcomes, from $(H, 1)$ to $(T, 6)$. With three experiments, each of these $12$ pairs goes with every outcome of the third, so multiply again.

> **Watch out.** The sizes multiply; they do not add. $2 + 6 = 8$ counts the results of the coin and of the die separately, not the pairs they make together.`,
        `两个试验一起做时，一个结果是一对：第一个试验的一个结果和第二个试验的一个结果。第一个试验的每个结果都能与第二个试验的**每个**结果配对，所以这些数对排成一个方阵：第一个试验的每个结果占一行，第二个试验的每个结果占一列。数对的个数是行数乘列数：样本空间的大小**相乘**。

抛一枚硬币并掷一枚骰子，方阵有 $2$ 行 $6$ 列：

{{figure 0}}

共 $2 \\times 6 = 12$ 个结果，从 $(H, 1)$ 到 $(T, 6)$。三个试验时，这 $12$ 对中的每一对再与第三个试验的每个结果配对，所以再乘一次。

> **注意。** 大小要相乘，不是相加。$2 + 6 = 8$ 只是分别数了硬币和骰子的结果，而不是它们一起组成的数对。`,
      ),
      figures: [
        {
          svg: dotGrid(2, 6),
          alt: t(
            "A grid of dots with 2 rows and 6 columns, one dot for each pair of a coin result and a die result.",
            "2 行 6 列的点阵，每个点代表硬币结果与骰子结果组成的一对。",
          ),
        },
      ],
      generate(rng) {
        const es = rng.sample(experiments, rng.int(2, 3));
        const sizes = es.map((e) => e.size);
        const product = sizes.reduce((p, x) => p * x, 1);
        const [first, second] = [sizes[0]!, sizes[1]!];
        const last = sizes[sizes.length - 1]!;
        const before = product / last;
        return {
          ...numberProblem({
            prompt: t(
              `How many outcomes are in the sample space of ${es.map((e) => e.en).join(" and ")}?`,
              `${es.map((e) => e.zh).join("并")}，样本空间中有多少个结果？`,
            ),
            answer: product,
            form: "integer",
            wrong: [sum(sizes), product - 1, sizes.length === 3 ? sizes[0]! * sizes[1]! : 2 * sum(sizes)],
            solution: t(
              `${stepLabel(1, "the size of each sample space", "各样本空间的大小").en} ${es.map((e) => `${e.en[0]!.toUpperCase()}${e.en.slice(1)} has $${e.size}$ outcomes.`).join(" ")}

${stepLabel(2, "pair them up", "配对").en} Each outcome of the first goes with each outcome of the second, a grid of $${first}$ rows and $${second}$ columns:

{{figure 0}}

${sizes.length === 3 ? `Each of those $${first * second}$ pairs goes with each of the $${last}$ outcomes of the third. ` : ""}So the sizes multiply:${steps(`${sizes.join(" \\times ")} = ${product}`)}**Check.** Count by adding instead: there are $${before}$ ${sizes.length === 3 ? "pairs of the first two" : "rows"}, each with $${last}$ outcomes, and $${last}$ added $${before}$ times is $${before} \\times ${last} = ${product}$.`,
              `${stepLabel(1, "the size of each sample space", "各样本空间的大小")["zh-CN"]}${es.map((e) => `${e.zh}有 $${e.size}$ 个结果。`).join("")}

${stepLabel(2, "pair them up", "配对")["zh-CN"]}第一个试验的每个结果与第二个试验的每个结果配对，排成 $${first}$ 行 $${second}$ 列的方阵：

{{figure 0}}

${sizes.length === 3 ? `这 $${first * second}$ 对中的每一对再与第三个试验的 $${last}$ 个结果配对。` : ""}所以大小相乘：${steps(`${sizes.join(" \\times ")} = ${product}`)}**检验。** 改用加法来数：共有 $${before}$ ${sizes.length === 3 ? "对（前两个试验）" : "行"}，每个配 $${last}$ 个结果，$${before}$ 个 $${last}$ 相加是 $${before} \\times ${last} = ${product}$。`,
            ),
          }),
          solutionFigures: [
            {
              svg: dotGrid(first, second),
              alt: t(
                `A grid of dots with ${first} rows and ${second} columns, one dot for each pair of outcomes of the first two experiments.`,
                `${first} 行 ${second} 列的点阵，每个点代表前两个试验的一对结果。`,
              ),
            },
          ],
        };
      },
    },
    {
      id: "outcomes-with-two-dice",
      title: t("Outcomes with two dice", "两枚骰子的结果"),
      explanation: t(
        `Rolling two dice has $6 \\times 6 = 36$ outcomes, the ordered pairs (first die, second die). A grid shows them all, the first die across and the second down; write in each cell the quantity the question is about, and shade the cells of the event. Here each cell holds the sum, and the cells with sum $5$ are shaded:

{{figure 0}}

They lie on one diagonal: $(1, 4), (2, 3), (3, 2), (4, 1)$, so $4$ outcomes. A formula checks it: a sum $s$ comes from $6 - |s - 7|$ pairs, and $6 - |5 - 7| = 4$.

> **Watch out.** $(1, 4)$ and $(4, 1)$ are different outcomes, because the dice are different: a $1$ on the first die and a $4$ on the second is not the same roll as the other way round. Counting only $\\{1, 4\\}$ and $\\{2, 3\\}$ gives $2$, half the true count.`,
        `掷两枚骰子有 $6 \\times 6 = 36$ 个结果，即有序数对（第一枚，第二枚）。用方格可以把它们全部画出来，第一枚横排，第二枚竖排；在每格中写上题目关心的量，并把事件的格子涂上阴影。下面每格写的是点数和，和为 $5$ 的格子涂上阴影：

{{figure 0}}

它们在一条对角线上：$(1, 4), (2, 3), (3, 2), (4, 1)$，共 $4$ 个结果。用公式检验：和为 $s$ 的数对有 $6 - |s - 7|$ 个，$6 - |5 - 7| = 4$。

> **注意。** $(1, 4)$ 与 $(4, 1)$ 是不同的结果，因为两枚骰子不同：第一枚掷出 $1$、第二枚掷出 $4$，与反过来不是同一次结果。只数 $\\{1, 4\\}$ 和 $\\{2, 3\\}$ 得到 $2$，只有正确答案的一半。`,
      ),
      figures: [
        diceFigure(
          (a, b) => a + b,
          (a, b) => a + b === 5,
          "the sum, with the four cells of sum 5 shaded",
          "点数和，和为 5 的四格涂上阴影",
        ),
      ],
      generate(rng) {
        const kind = rng.pick(["sum", "atLeast", "atMost", "product", "doubles"] as const);
        if (kind === "product") {
          const v = rng.pick([4, 6, 8, 12, 18, 24]);
          const firsts = range(1, 6).filter((a) => v % a === 0 && v / a <= 6);
          const pairs = firsts.map((a) => `(${a}, ${v / a})`);
          const square = firsts.filter((a) => a * a === v).length;
          const unorderedPairs = (pairs.length - square) / 2;
          return {
            ...numberProblem({
              prompt: t(
                `Two six-sided dice are rolled. How many outcomes have a product of ${v}?`,
                `掷两枚六面骰子。点数积为 ${v} 的结果有多少个？`,
              ),
              answer: pairs.length,
              form: "integer",
              wrong: [Math.ceil(pairs.length / 2), pairs.length + 1],
              solution: t(
                `${stepLabel(1, "the grid of products", "积的方格").en} Write the product in each of the $36$ cells and shade those equal to $${v}$:

{{figure 0}}

${stepLabel(2, "list and count", "列出并计数").en} For each first die $a$, the second must be $${v} \\div a$, a whole number from $1$ to $6$:${steps(pairs.join(", "))}There are $${pairs.length}$ outcomes.

**Check.** ${unorderedPairs > 0 ? `Each pair of different numbers comes twice, once in each order: $${unorderedPairs}$ such pair${unorderedPairs === 1 ? "" : "s"} give${unorderedPairs === 1 ? "s" : ""} $2 \\times ${unorderedPairs} = ${2 * unorderedPairs}$` : "No pair of different numbers works"}${square ? `, and $(${Math.sqrt(v)}, ${Math.sqrt(v)})$ comes only once` : ""}: $${pairs.length}$ in all.`,
                `${stepLabel(1, "the grid of products", "积的方格")["zh-CN"]}在 $36$ 个格子中写上点数积，把等于 $${v}$ 的涂上阴影：

{{figure 0}}

${stepLabel(2, "list and count", "列出并计数")["zh-CN"]}第一枚为 $a$ 时，第二枚必须是 $${v} \\div a$，并且是 $1$ 到 $6$ 的整数：${steps(pairs.join(", "))}共 $${pairs.length}$ 个结果。

**检验。** ${unorderedPairs > 0 ? `两个数不同的每一对都按两种顺序各出现一次：$${unorderedPairs}$ 对给出 $2 \\times ${unorderedPairs} = ${2 * unorderedPairs}$ 个` : "没有两个数不同的数对"}${square ? `，$(${Math.sqrt(v)}, ${Math.sqrt(v)})$ 只出现一次` : ""}：共 $${pairs.length}$ 个。`,
              ),
            }),
            solutionFigures: [
              diceFigure(
                (a, b) => a * b,
                (a, b) => a * b === v,
                `the product, with the cells of product ${v} shaded`,
                `点数积，积为 ${v} 的格子涂上阴影`,
              ),
            ],
          };
        }
        if (kind === "doubles") {
          const d = rng.int(1, 5);
          const pairs = range(1, 6).flatMap((a) =>
            range(1, 6)
              .filter((b) => Math.abs(a - b) === d)
              .map((b) => `(${a}, ${b})`),
          );
          return {
            ...numberProblem({
              prompt: t(
                `Two six-sided dice are rolled. How many outcomes have numbers that differ by ${d}?`,
                `掷两枚六面骰子。两个点数相差 ${d} 的结果有多少个？`,
              ),
              answer: pairs.length,
              form: "integer",
              wrong: [pairs.length / 2, 6 - d],
              solution: t(
                `${stepLabel(1, "the grid of differences", "差的方格").en} Write the difference, larger minus smaller, in each of the $36$ cells and shade those equal to $${d}$:

{{figure 0}}

${stepLabel(2, "list and count", "列出并计数").en}${steps(pairs.join(", "))}There are $${pairs.length}$ outcomes.

**Check.** The shaded cells form two diagonals, one with the first die higher and one with the second higher. On each, the smaller number runs from $1$ to $${6 - d}$, so each holds $6 - ${d} = ${6 - d}$ cells, and $2 \\times ${6 - d} = ${pairs.length}$.`,
                `${stepLabel(1, "the grid of differences", "差的方格")["zh-CN"]}在 $36$ 个格子中写上两数之差（大减小），把等于 $${d}$ 的涂上阴影：

{{figure 0}}

${stepLabel(2, "list and count", "列出并计数")["zh-CN"]}${steps(pairs.join(", "))}共 $${pairs.length}$ 个结果。

**检验。** 阴影格子组成两条对角线，一条是第一枚较大，一条是第二枚较大。每条上较小的数从 $1$ 到 $${6 - d}$，所以各有 $6 - ${d} = ${6 - d}$ 格，$2 \\times ${6 - d} = ${pairs.length}$。`,
              ),
            }),
            solutionFigures: [
              diceFigure(
                (a, b) => Math.abs(a - b),
                (a, b) => Math.abs(a - b) === d,
                `the difference, with the cells of difference ${d} shaded`,
                `两数之差，差为 ${d} 的格子涂上阴影`,
              ),
            ],
          };
        }
        const s = kind === "sum" ? rng.int(3, 11) : kind === "atLeast" ? rng.int(8, 11) : rng.int(3, 6);
        const sums = kind === "sum" ? [s] : kind === "atLeast" ? range(s, 12) : range(2, s);
        const n = sum(sums.map(diceSum));
        const pairs = sums.flatMap((v) =>
          range(1, 6)
            .filter((a) => v - a >= 1 && v - a <= 6)
            .map((a) => `(${a}, ${v - a})`),
        );
        const unordered = sum(sums.map((v) => Math.ceil(diceSum(v) / 2)));
        const has = (a: number, b: number) => sums.includes(a + b);
        const which = t(
          kind === "sum" ? `equal to ${s}` : kind === "atLeast" ? `of at least ${s}` : `of at most ${s}`,
          kind === "sum" ? `等于 ${s}` : kind === "atLeast" ? `不小于 ${s}` : `不大于 ${s}`,
        );
        return {
          ...numberProblem({
            prompt:
              kind === "sum"
                ? t(
                    `Two six-sided dice are rolled. How many outcomes have a sum of ${s}?`,
                    `掷两枚六面骰子。点数和为 ${s} 的结果有多少个？`,
                  )
                : kind === "atLeast"
                  ? t(
                      `Two six-sided dice are rolled. How many outcomes have a sum of at least ${s}?`,
                      `掷两枚六面骰子。点数和不小于 ${s} 的结果有多少个？`,
                    )
                  : t(
                      `Two six-sided dice are rolled. How many outcomes have a sum of at most ${s}?`,
                      `掷两枚六面骰子。点数和不大于 ${s} 的结果有多少个？`,
                    ),
            answer: n,
            form: "integer",
            wrong: [unordered, sums.length, kind === "sum" ? s - 1 : n - diceSum(s)],
            solution: t(
              `${stepLabel(1, "the grid of sums", "和的方格").en} Write the sum in each of the $36$ cells and shade the sums ${which.en}:

{{figure 0}}

${stepLabel(2, "list and count", "列出并计数").en} The shaded cells are the ordered pairs${steps(pairs.join(", "))}There are $${n}$ outcomes.

**Check.** A sum $v$ comes from $6 - |v - 7|$ ordered pairs: ${kind === "sum" ? `$6 - |${s} - 7| = ${n}$` : `$${sumCounts(sums)}$, and $${plus(sums.map(diceSum))}$`}.`,
              `${stepLabel(1, "the grid of sums", "和的方格")["zh-CN"]}在 $36$ 个格子中写上点数和，把和${which["zh-CN"]}的涂上阴影：

{{figure 0}}

${stepLabel(2, "list and count", "列出并计数")["zh-CN"]}阴影格子是这些有序数对${steps(pairs.join(", "))}共 $${n}$ 个结果。

**检验。** 和为 $v$ 的有序数对有 $6 - |v - 7|$ 个：${kind === "sum" ? `$6 - |${s} - 7| = ${n}$` : `$${sumCounts(sums)}$，$${plus(sums.map(diceSum))}$`}。`,
            ),
          }),
          solutionFigures: [
            diceFigure((a, b) => a + b, has, `the sum, with the sums ${which.en} shaded`, `点数和，和${which["zh-CN"]}的格子涂上阴影`),
          ],
        };
      },
    },
  ],
};

const likelihoods: readonly Text[] = [
  t("Impossible", "不可能"),
  t("Unlikely", "不太可能"),
  t("As likely as not", "可能性各半"),
  t("Likely", "很可能"),
  t("Certain", "必然"),
];

/** likelihoodOf classifies a probability: 0 impossible, 1 unlikely, 2 as likely as not, 3 likely, 4 certain. */
function likelihoodOf(p: Q): number {
  if (p.isZero()) return 0;
  if (p.eq(Q.one)) return 4;
  const c = p.cmp(Q.of(1, 2));
  return c < 0 ? 1 : c === 0 ? 2 : 3;
}

/** halfWords says how a probability compares with 1/2: "below", "equal to", "above", in both locales. */
const halfWords = (p: Q) => {
  const c = p.cmp(Q.of(1, 2));
  return c < 0 ? (["below", "小于"] as const) : c === 0 ? (["equal to", "等于"] as const) : (["above", "大于"] as const);
};

/** likelihoodScaleFigure draws the probability scale with a point at p. */
const likelihoodScaleFigure = (p: Q, shown: string): Figure => ({
  svg: probabilityScale(p, "P"),
  alt: t(`The probability scale from 0 to 1 with the point ${shown} marked.`, `从 0 到 1 的概率刻度，标出了点 ${shown}。`),
});

/** likelihoodIntro draws the probability 3/10 on the scale from 0 to 1. */
const likelihoodIntro: Figure = likelihoodScaleFigure(Q.of(3, 10), "3/10");

/** theLikelihoodOfAnEvent is outline topic 6.16.5. */
export const theLikelihoodOfAnEvent: TopicDef = {
  id: "the-likelihood-of-an-event",
  title: t("The Likelihood of an Event", "事件的可能性"),
  summary: t(
    "Describe how likely an event is from its probability on the scale from 0 to 1.",
    "根据 0 到 1 之间的概率描述事件发生的可能性。",
  ),
  prerequisites: ["sample-spaces-and-events-in-probability", "percents"],
  encompasses: [],
  xp: 8,
  standards: ["CCSS.7.SP.C.5"],
  intro: t(
    `An event is a subset of the sample space. When the outcomes are equally likely, the share of the sample space that the event takes up measures how likely it is, and that share is a number from $0$ to $1$.

Draw one of ten cards numbered $1$ to $10$. The event "the number is at most $3$" holds $3$ of the $10$ outcomes, so its probability is $\\frac{3}{10}$. Mark it on a line from $0$ to $1$:

{{figure 0}}

The two ends are the extremes. An event with no outcomes, such as drawing $11$, has probability $0$ and is **impossible**; an event holding every outcome, such as drawing a number below $20$, has probability $1$ and is **certain**. The middle, $\\frac{1}{2}$, splits the rest: $\\frac{3}{10}$ lies left of it, so drawing at most $3$ is **unlikely**, while drawing more than $3$, at $\\frac{7}{10}$, is **likely**. In this lesson we place probabilities on this scale and describe how likely events are.`,
    `事件是样本空间的子集。当各结果等可能时，事件在样本空间中所占的比例衡量了它有多大可能发生，这个比例是 $0$ 到 $1$ 之间的数。

从编号 $1$ 到 $10$ 的十张卡片中抽一张。事件“数不大于 $3$”包含 $10$ 个结果中的 $3$ 个，所以它的概率是 $\\frac{3}{10}$。把它标在从 $0$ 到 $1$ 的线段上：

{{figure 0}}

两端是两个极端。不含任何结果的事件（例如抽到 $11$）概率为 $0$，是**不可能**的；包含所有结果的事件（例如抽到小于 $20$ 的数）概率为 $1$，是**必然**的。中间的 $\\frac{1}{2}$ 把其余部分分开：$\\frac{3}{10}$ 在它左边，所以抽到不大于 $3$ 的数**不太可能**；而抽到大于 $3$ 的数，概率 $\\frac{7}{10}$，**很可能**。这节课我们把概率放在这条刻度上，描述事件发生的可能性。`,
  ),
  introFigures: [likelihoodIntro],
  knowledgePoints: [
    {
      id: "the-probability-scale",
      title: t("The probability scale", "概率刻度"),
      explanation: t(
        `A probability is a number from $0$ to $1$, written as a fraction, a decimal or a percent. The larger it is, the more likely the event, and $\\frac{1}{2}$ is the point where an event is as likely to happen as not:

| Probability | Likelihood |
| :--- | :--- |
| $0$ | impossible |
| between $0$ and $\\frac{1}{2}$ | unlikely |
| $\\frac{1}{2}$ | as likely as not |
| between $\\frac{1}{2}$ and $1$ | likely |
| $1$ | certain |

So the work is to compare the probability with $\\frac{1}{2}$ in the same form: $0.5$ for a decimal, $50\\%$ for a percent. A probability of $0.35$ is below $0.5$, so the event is unlikely. For $\\frac{5}{8}$, half of $8$ is $4$, and $\\frac{5}{8} > \\frac{4}{8}$, so the event is likely.

> **Watch out.** "Unlikely" does not mean impossible: only a probability of exactly $0$ is impossible, and only exactly $1$ is certain. A small probability such as $0.02$ is still unlikely, not impossible.`,
        `概率是 $0$ 到 $1$ 之间的数，可写成分数、小数或百分数。概率越大，事件越可能发生；$\\frac{1}{2}$ 是事件发生与不发生可能性相同的分界点：

| 概率 | 可能性 |
| :--- | :--- |
| $0$ | 不可能 |
| $0$ 与 $\\frac{1}{2}$ 之间 | 不太可能 |
| $\\frac{1}{2}$ | 可能性各半 |
| $\\frac{1}{2}$ 与 $1$ 之间 | 很可能 |
| $1$ | 必然 |

所以要做的是把概率与同一形式的 $\\frac{1}{2}$ 比较：小数用 $0.5$，百分数用 $50\\%$。概率 $0.35$ 小于 $0.5$，所以事件不太可能发生。对于 $\\frac{5}{8}$，$8$ 的一半是 $4$，$\\frac{5}{8} > \\frac{4}{8}$，所以事件很可能发生。

> **注意。** “不太可能”不等于不可能：只有概率恰为 $0$ 才不可能，恰为 $1$ 才必然。像 $0.02$ 这样小的概率仍然是“不太可能”，而不是“不可能”。`,
      ),
      generate(rng) {
        const cat = rng.pick([0, 1, 1, 2, 3, 3, 4]);
        const style = rng.pick(["fraction", "decimal", "percent"] as const);
        let p: Q;
        if (cat === 0) p = Q.zero;
        else if (cat === 4) p = Q.one;
        else if (cat === 2) p = Q.of(1, 2);
        else {
          const d = style === "fraction" ? rng.int(3, 20) : 100;
          const lo = cat === 1 ? 1 : Math.floor(d / 2) + 1;
          const hi = cat === 1 ? Math.ceil(d / 2) - 1 : d - 1;
          p = Q.of(rng.int(lo, hi), d);
        }
        const shown =
          style === "percent" ? `${p.mul(Q.of(100)).toLatex()}\\%` : style === "decimal" && !p.isInteger() ? dec(p) : p.toLatex();
        const fair = cat === 2 && style === "fraction" ? `\\frac{${rng.int(2, 9)}}{}` : "";
        const value = fair ? `\\frac{${fair.slice(6, -3)}}{${2 * Number(fair.slice(6, -3))}}` : shown;
        const q = Q.one.sub(p);
        const other =
          style === "percent"
            ? `${q.mul(Q.of(100)).toLatex()}\\%`
            : style === "decimal" && !q.isInteger()
              ? dec(q)
              : fair
                ? value
                : q.toLatex();
        const one = style === "percent" ? "100\\%" : "1";
        const [hw, hz] = halfWords(p);
        const compare: Text =
          cat === 0
            ? t(`The probability is exactly $0$: no outcome makes the event happen.`, `概率恰为 $0$：没有任何结果使事件发生。`)
            : cat === 4
              ? t(`The probability is exactly $${one}$: every outcome makes the event happen.`, `概率恰为 $${one}$：每个结果都使事件发生。`)
              : style === "percent"
                ? t(`Compare with half, $50\\%$: $${value}$ is ${hw} $50\\%$.`, `与一半即 $50\\%$ 比较：$${value}$ ${hz} $50\\%$。`)
                : style === "decimal"
                  ? t(`Compare with half, $0.5$: $${value}$ is ${hw} $0.5$.`, `与一半即 $0.5$ 比较：$${value}$ ${hz} $0.5$。`)
                  : (() => {
                      const [a, d] = fair ? [Number(fair.slice(6, -3)), 2 * Number(fair.slice(6, -3))] : [Number(p.n), Number(p.d)];
                      return t(
                        `Compare with half using the same bottom: $\\frac{1}{2} = \\frac{${d}}{${2 * d}}$ and $${value} = \\frac{${2 * a}}{${2 * d}}$, so $${value}$ is ${hw} $\\frac{1}{2}$.`,
                        `化成同分母再与一半比较：$\\frac{1}{2} = \\frac{${d}}{${2 * d}}$，$${value} = \\frac{${2 * a}}{${2 * d}}$，所以 $${value}$ ${hz} $\\frac{1}{2}$。`,
                      );
                    })();
        return {
          ...choiceProblem({
            prompt: t(
              `The probability of an event is $${value}$. How likely is the event?`,
              `某事件的概率是 $${value}$。这个事件发生的可能性如何？`,
            ),
            options: likelihoods,
            correct: cat,
            solution: t(
              `${stepLabel(1, "compare", "比较").en} ${compare.en}

${stepLabel(2, "place it on the scale", "放到刻度上").en}

{{figure 0}}

The event is: ${likelihoods[cat]!.en.toLowerCase()}.

**Check.** The event fails to happen with probability $${one} - ${value} = ${other}$.${cat === 2 ? " That is also one half, so happening and not happening are equally likely." : cat === 0 || cat === 4 ? ` So ${cat === 0 ? "not happening is certain" : "not happening is impossible"}, the other end of the scale.` : ` That is on the other side of one half, so ${cat === 1 ? "not happening is the likely one" : "not happening is the unlikely one"}, as it should be.`}`,
              `${stepLabel(1, "compare", "比较")["zh-CN"]}${compare["zh-CN"]}

${stepLabel(2, "place it on the scale", "放到刻度上")["zh-CN"]}

{{figure 0}}

这个事件：${likelihoods[cat]!["zh-CN"]}。

**检验。** 事件不发生的概率是 $${one} - ${value} = ${other}$。${cat === 2 ? "它也是一半，所以发生与不发生的可能性相同。" : cat === 0 || cat === 4 ? `所以不发生是${cat === 0 ? "必然" : "不可能"}的，在刻度的另一端。` : `它在一半的另一侧，所以不发生${cat === 1 ? "很可能" : "不太可能"}，与预期相符。`}`,
            ),
          }),
          solutionFigures: [likelihoodScaleFigure(p, value.replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2").replace("\\%", "%"))],
        };
      },
    },
    {
      id: "likelihood-from-outcomes",
      title: t("Likelihood from the outcomes", "由结果判断可能性"),
      explanation: t(
        `When all outcomes are equally likely, the probability of an event is its share of the outcomes, so its likelihood can be read by comparing the number of outcomes in the event with **half the total**. An event with no outcomes is impossible; one containing every outcome is certain. Otherwise it is likely when it holds more than half of the outcomes, unlikely when fewer than half, and as likely as not when exactly half.

A bag holds $7$ red and $5$ blue marbles, $12$ in all, and half of $12$ is $6$. Drawing red is likely, since $7 > 6$; drawing blue is unlikely, since $5 < 6$; drawing green is impossible, as there are none; drawing red or blue is certain.

> **Watch out.** Compare with half of **all** the outcomes, not with the other color alone. And an event is only impossible when it has no outcomes at all; a single red marble among many makes red unlikely, not impossible.`,
        `当所有结果等可能时，事件的概率就是它所占结果的比例，所以把事件包含的结果数与**总数的一半**比较，就能判断可能性。不含任何结果的事件不可能发生；包含所有结果的事件必然发生。否则，包含的结果多于一半时很可能，少于一半时不太可能，恰好一半时可能性各半。

袋中有 $7$ 个红球和 $5$ 个蓝球，共 $12$ 个，$12$ 的一半是 $6$。摸到红球很可能，因为 $7 > 6$；摸到蓝球不太可能，因为 $5 < 6$；摸到绿球不可能，因为袋中没有绿球；摸到红球或蓝球是必然的。

> **注意。** 要与**全部**结果的一半比较，而不是只与另一种颜色比较。只有事件一个结果也没有时才是不可能的；许多球中只有一个红球，摸到红球是不太可能，而不是不可能。`,
      ),
      generate(rng) {
        const cat = rng.int(0, 4);
        const cs = rng.sample(colors, 3);
        const counts = [rng.int(1, 12), rng.int(1, 12), rng.int(1, 12)];
        let event: Text;
        let inBag: number[];
        let k: number;
        if (cat === 0) {
          inBag = [0, 1];
          k = 0;
          event = t(`a ${cs[2]![0]} marble`, `${cs[2]![1]}球`);
        } else if (cat === 4) {
          inBag = [0, 1];
          k = counts[0]! + counts[1]!;
          event = t(`a ${cs[0]![0]} or a ${cs[1]![0]} marble`, `${cs[0]![1]}球或${cs[1]![1]}球`);
        } else {
          inBag = [0, 1, 2];
          const others = counts[1]! + counts[2]!;
          counts[0] = cat === 1 ? rng.int(1, others - 1 || 1) : cat === 2 ? others : others + rng.int(1, 8);
          if (cat === 1 && others < 2) counts[1] = counts[1]! + 2;
          k = counts[0];
          event = t(`a ${cs[0]![0]} marble`, `${cs[0]![1]}球`);
        }
        const total = sum(inBag.map((i) => counts[i]!));
        const bag = (lang: 0 | 1) =>
          inBag.map((i) => (lang === 0 ? `${counts[i]} ${cs[i]![0]}` : `${counts[i]} 个${cs[i]![1]}球`)).join(lang === 0 ? ", " : "、");
        const p = Q.of(k, total);
        const cat2 = likelihoodOf(p);
        const half = Q.of(total, 2).toLatex();
        const plain = event.en.replace(/^an? /, "").replace(/ marble$/, "");
        const marked = (i: number) => (cat === 4 ? true : cat === 0 ? false : i === 0);
        const decide: Text =
          cat2 === 0
            ? t(`There are no ${plain} marbles in the bag, so no draw can give one.`, `袋中没有${event["zh-CN"]}，所以不可能摸到。`)
            : cat2 === 4
              ? t(`Every marble in the bag is ${plain}, so every draw gives one.`, `袋中每个球都是${event["zh-CN"]}，所以每次都会摸到。`)
              : t(
                  `Half of $${total}$ is $${half}$, and $${k}$ is ${cat2 === 1 ? "less than" : cat2 === 2 ? "exactly" : "more than"} $${half}$.`,
                  `$${total}$ 的一半是 $${half}$，$${k}$ ${cat2 === 1 ? "小于" : cat2 === 2 ? "正好等于" : "大于"} $${half}$。`,
                );
        return {
          ...choiceProblem({
            prompt: t(
              `A bag holds ${bag(0)} marbles. One marble is drawn at random. How likely is it to be ${event.en}?`,
              `袋中有${bag(1)}。随机摸出一个球，摸到${event["zh-CN"]}的可能性如何？`,
            ),
            options: likelihoods,
            correct: cat2,
            solution: t(
              `${stepLabel(1, "count", "计数").en} The bag holds $${plus(inBag.map((i) => counts[i]!))}$ marbles, and $${k}$ of them are ${plain}, shaded below:

{{figure 0}}

${stepLabel(2, "compare with half", "与一半比较").en} ${decide.en} So the event is: ${likelihoods[cat2]!.en.toLowerCase()}.

**Check.** As a probability, $${ratio(k, total)}$, which is ${cat2 === 0 ? "$0$" : cat2 === 4 ? "$1$" : `${halfWords(p)[0]} $\\frac{1}{2}$`}. The other marbles number $${total} - ${k} = ${total - k}$, so not getting ${event.en} has probability $\\frac{${total - k}}{${total}}$, and the two add to $1$.`,
              `${stepLabel(1, "count", "计数")["zh-CN"]}袋中共有 $${plus(inBag.map((i) => counts[i]!))}$ 个球，其中 $${k}$ 个是${event["zh-CN"]}（下图阴影）：

{{figure 0}}

${stepLabel(2, "compare with half", "与一半比较")["zh-CN"]}${decide["zh-CN"]}所以这个事件：${likelihoods[cat2]!["zh-CN"]}。

**检验。** 写成概率是 $${ratio(k, total)}$，${cat2 === 0 ? "等于 $0$" : cat2 === 4 ? "等于 $1$" : `${halfWords(p)[1]} $\\frac{1}{2}$`}。其余的球有 $${total} - ${k} = ${total - k}$ 个，所以摸不到${event["zh-CN"]}的概率是 $\\frac{${total - k}}{${total}}$，两者之和为 $1$。`,
            ),
          }),
          solutionFigures: [
            {
              svg: marbles(
                inBag.map((i) => counts[i]!),
                (j) => marked(inBag[j]!),
              ),
              alt: t(
                `The ${total} marbles in the bag, with the ${k} that are ${plain} shaded.`,
                `袋中的 ${total} 个球，其中 ${k} 个${event["zh-CN"]}涂上阴影。`,
              ),
            },
          ],
        };
      },
    },
  ],
};

/** bagFigure draws a bag of marbles with one color's marbles shaded. */
const bagFigure = (f: readonly number[], i: number, en: string, zh: string): Figure => ({
  svg: marbles(f, (j) => j === i),
  alt: t(en, zh),
});

/** singleEventsIntro draws a spinner of 8 equal sections with 3 shaded. */
const singleEventsIntro: Figure = {
  svg: spinner(8, 3),
  alt: t("A spinner of 8 equal sections, 3 of them shaded.", "有 8 个相等扇区的转盘，其中 3 个涂上阴影。"),
};

/** singleEventsInProbability is outline topic 6.16.6. */
export const singleEventsInProbability: TopicDef = {
  id: "single-events-in-probability",
  title: t("Single Events in Probability", "单个事件的概率"),
  summary: t(
    "Compute the probability of an event whose outcomes are equally likely as favorable outcomes over all outcomes.",
    "对等可能的结果，用有利结果数除以结果总数求事件的概率。",
  ),
  prerequisites: ["the-likelihood-of-an-event"],
  encompasses: [{ topic: "sample-spaces-and-events-in-probability", weight: 0.3 }],
  xp: 12,
  standards: ["CCSS.7.SP.C.7.A"],
  intro: t(
    `On the probability scale we only said whether an event takes up more or less than half of the outcomes. Now we find its exact place: when every outcome is equally likely, the probability is the **share of the outcomes** in the event.

A spinner has $8$ equal sections, and $3$ of them are shaded:

{{figure 0}}

Each section is equally likely to stop under the pointer, so each has probability $\\frac{1}{8}$, and the shaded part takes up $3$ of these eighths:

$$P(\\text{shaded}) = \\frac{3}{8}.$$

The same reasoning works for any experiment with equally likely outcomes: count the outcomes in the event, count all the outcomes, and divide. In this lesson we apply it to marbles in a bag, numbered cards, and the sums of two dice.`,
    `在概率刻度上，我们只判断了事件占全部结果的一半以上还是以下。现在要求出它的确切位置：当每个结果等可能时，概率就是事件所含结果占**全部结果的比例**。

一个转盘有 $8$ 个相等的扇区，其中 $3$ 个涂上了阴影：

{{figure 0}}

每个扇区停在指针下的可能性相同，所以每个扇区的概率是 $\\frac{1}{8}$，阴影部分占其中 $3$ 份：

$$P(\\text{阴影}) = \\frac{3}{8}.$$

对任何结果等可能的试验，道理都一样：数出事件包含的结果，数出全部结果，再相除。这节课我们把它用于袋中摸球、编号卡片和两枚骰子的点数和。`,
  ),
  introFigures: [singleEventsIntro],
  knowledgePoints: [
    {
      id: "drawing-from-a-bag",
      title: t("Drawing from a bag", "从袋中摸球"),
      explanation: t(
        `When all outcomes are **equally likely**, each one carries the same share of the probability, so an event's probability is its share of the outcomes:

$$P(E) = \\frac{\\text{number of outcomes in } E}{\\text{total number of outcomes}}$$

Drawing from a bag, each **marble** is an outcome, whatever its color. A bag holds $3$ red, $5$ blue and $4$ green marbles, $3 + 5 + 4 = 12$ in all. Each marble is equally likely to be drawn, so $P(\\text{blue}) = \\frac{5}{12}$ and $P(\\text{green}) = \\frac{4}{12} = \\frac{1}{3}$.

> **Watch out.** Divide by the **total** number of marbles, not by the number of other marbles: $\\frac{5}{7}$ compares blue with not blue. And the colors are not the outcomes: three colors do not make each one $\\frac{1}{3}$ likely when there are more marbles of one color.`,
        `当所有结果**等可能**时，每个结果分得同样多的概率，所以事件的概率就是它所含结果的比例：

$$P(E) = \\frac{E \\text{ 包含的结果数}}{\\text{结果总数}}$$

从袋中摸球时，每个**球**是一个结果，不管它是什么颜色。袋中有 $3$ 个红球、$5$ 个蓝球、$4$ 个绿球，共 $3 + 5 + 4 = 12$ 个。每个球被摸到的可能性相同，所以 $P(\\text{蓝}) = \\frac{5}{12}$，$P(\\text{绿}) = \\frac{4}{12} = \\frac{1}{3}$。

> **注意。** 分母是球的**总数**，而不是其他球的个数：$\\frac{5}{7}$ 是蓝球与非蓝球之比。颜色也不是结果：某种颜色的球多时，三种颜色并不意味着每种的概率都是 $\\frac{1}{3}$。`,
      ),
      generate(rng) {
        const cs = rng.sample(colors, rng.int(2, 4));
        const f = cs.map(() => rng.int(1, 15));
        const i = rng.int(0, cs.length - 1);
        const total = sum(f);
        const k = f[i]!;
        const others = f.filter((_, j) => j !== i);
        const bag = (lang: 0 | 1) =>
          cs.map((c, j) => (lang === 0 ? `${f[j]} ${c[0]}` : `${f[j]} 个${c[1]}球`)).join(lang === 0 ? ", " : "、");
        return {
          ...probProblem(
            t(
              `A bag holds ${bag(0)} marbles. One marble is drawn at random. What is the probability that it is ${cs[i]![0]}?`,
              `袋中有${bag(1)}。随机摸出一个球，摸到${cs[i]![1]}球的概率是多少？`,
            ),
            Q.of(k, total),
            t(
              `${stepLabel(1, "count all the marbles", "数出所有的球").en} Each marble is one equally likely outcome:${steps(`${f.join(" + ")} = ${total}`)}${stepLabel(2, "count the event and divide", "数出事件并相除").en} $${k}$ of them are ${cs[i]![0]}, shaded below:

{{figure 0}}${steps(`P(\\text{${cs[i]![0]}}) = ${ratio(k, total)}`)}**Check.** The other marbles number $${plus(others)}$, so $P(\\text{not ${cs[i]![0]}}) = \\frac{${sum(others)}}{${total}}$, and $\\frac{${k}}{${total}} + \\frac{${sum(others)}}{${total}} = 1$. The answer lies between $0$ and $1$.`,
              `${stepLabel(1, "count all the marbles", "数出所有的球")["zh-CN"]}每个球是一个等可能的结果：${steps(`${f.join(" + ")} = ${total}`)}${stepLabel(2, "count the event and divide", "数出事件并相除")["zh-CN"]}其中 $${k}$ 个是${cs[i]![1]}球（下图阴影）：

{{figure 0}}${steps(`P = ${ratio(k, total)}`)}**检验。** 其余的球有 $${plus(others)}$ 个，所以摸不到${cs[i]![1]}球的概率是 $\\frac{${sum(others)}}{${total}}$，$\\frac{${k}}{${total}} + \\frac{${sum(others)}}{${total}} = 1$。答案在 $0$ 与 $1$ 之间。`,
            ),
            [Q.of(k, total - k), Q.of(1, cs.length), Q.of(1, total), Q.of(k, 10)],
          ),
          solutionFigures: [
            bagFigure(
              f,
              i,
              `The ${total} marbles, with the ${k} ${cs[i]![0]} ones shaded.`,
              `${total} 个球，其中 ${k} 个${cs[i]![1]}球涂上阴影。`,
            ),
          ],
        };
      },
    },
    {
      id: "numbered-cards",
      title: t("Numbered cards", "编号卡片"),
      explanation: t(
        `With numbered cards, each card is one equally likely outcome. So find the event's outcomes by testing every number, count them, and divide by the number of cards.

A card is drawn from $20$ cards numbered $1$ to $20$. Testing each number for "multiple of $3$" leaves $3, 6, 9, 12, 15, 18$, which is $6$ cards. So

$$P(\\text{multiple of } 3) = \\frac{6}{20} = \\frac{3}{10}.$$

As a check, $20 \\div 3$ is $6$ with remainder $2$: there are $6$ whole multiples of $3$ up to $20$.

> **Watch out.** Read the boundary words exactly: "less than $8$" leaves $8$ out, "at least $8$" keeps it in. And the multiples of a number start at the number itself, while its factors run from $1$ up to it.`,
        `对于编号卡片，每张卡片是一个等可能的结果。所以逐个检验各数，找出事件的结果，数出个数，再除以卡片总数。

从编号 $1$ 到 $20$ 的 $20$ 张卡片中抽一张。逐个检验“是 $3$ 的倍数”，留下 $3, 6, 9, 12, 15, 18$，共 $6$ 张。所以

$$P(3 \\text{ 的倍数}) = \\frac{6}{20} = \\frac{3}{10}.$$

检验一下：$20 \\div 3$ 得 $6$ 余 $2$，所以到 $20$ 为止有 $6$ 个 $3$ 的倍数。

> **注意。** 分界的词要读准：“小于 $8$”不含 $8$，“不小于 $8$”含 $8$。一个数的倍数从这个数本身开始，而它的因数从 $1$ 到它本身。`,
      ),
      generate(rng) {
        const n = rng.int(10, 30);
        for (;;) {
          const e = numberEvent(rng, n);
          const s = range(1, n);
          const ev = s.filter(e.test);
          if (ev.length === 0 || ev.length === n) continue;
          return {
            ...probProblem(
              t(
                `A card is drawn at random from ${n} cards numbered 1 to ${n}. What is the probability that the number is ${e.en}?`,
                `从编号 1 到 ${n} 的 ${n} 张卡片中随机抽一张。这个数${e.zh}的概率是多少？`,
              ),
              Q.of(ev.length, n),
              t(
                `${stepLabel(1, "find the outcomes in the event", "找出事件中的结果").en} Test each of the numbers $1$ to $${n}$; those that are ${e.en} are shaded:

{{figure 0}}

That is $${ev.join(", ")}$: $${ev.length}$ cards.

${stepLabel(2, "divide by the number of cards", "除以卡片总数").en} Each of the $${n}$ cards is equally likely:${steps(`P = ${ratio(ev.length, n)}`)}**Check.** At the boundary, ${e.edge.en}. The other $${n} - ${ev.length} = ${n - ev.length}$ cards are not ${e.en}, and $\\frac{${ev.length}}{${n}} + \\frac{${n - ev.length}}{${n}} = 1$.`,
                `${stepLabel(1, "find the outcomes in the event", "找出事件中的结果")["zh-CN"]}逐个检验 $1$ 到 $${n}$，${e.zh}的数涂上阴影：

{{figure 0}}

即 $${ev.join(", ")}$，共 $${ev.length}$ 张。

${stepLabel(2, "divide by the number of cards", "除以卡片总数")["zh-CN"]}$${n}$ 张卡片中每张被抽到的可能性相同：${steps(`P = ${ratio(ev.length, n)}`)}**检验。** 看分界处：${e.edge["zh-CN"]}。其余 $${n} - ${ev.length} = ${n - ev.length}$ 张不满足，$\\frac{${ev.length}}{${n}} + \\frac{${n - ev.length}}{${n}} = 1$。`,
              ),
              [Q.of(s.filter(e.loose).length, n), Q.of(n - ev.length, n), Q.of(ev.length, n - ev.length)],
            ),
            solutionFigures: [
              stripFigure(s, e.test, `The cards 1 to ${n}, with those that are ${e.en} shaded.`, `卡片 1 到 ${n}，其中${e.zh}的涂上阴影。`),
            ],
          };
        }
      },
    },
    {
      id: "sums-of-two-dice",
      title: t("Sums of two dice", "两枚骰子的点数和"),
      explanation: t(
        `Two dice have $36$ equally likely outcomes, the ordered pairs. The sums $2$ to $12$ are **not** equally likely, because they are made by different numbers of pairs: only $(1, 1)$ gives $2$, while six pairs give $7$. So the outcomes to count are the pairs, not the sums.

A sum of $9$ comes from $(3, 6), (4, 5), (5, 4), (6, 3)$, four of the $36$ pairs:

$$P(\\text{sum} = 9) = \\frac{4}{36} = \\frac{1}{9}.$$

The formula $6 - |s - 7|$ for the number of pairs with sum $s$ checks it: $6 - |9 - 7| = 4$.

> **Watch out.** There are $11$ possible sums, but $P(\\text{sum} = 9)$ is not $\\frac{1}{11}$: the sums are not equally likely. Divide by the $36$ pairs, and count $(4, 5)$ and $(5, 4)$ separately.`,
        `两枚骰子有 $36$ 个等可能的结果，即有序数对。点数和 $2$ 到 $12$ **并不**等可能，因为组成它们的数对个数不同：只有 $(1, 1)$ 的和是 $2$，而和为 $7$ 的有六对。所以要数的是数对，而不是和。

和为 $9$ 的有 $(3, 6), (4, 5), (5, 4), (6, 3)$，是 $36$ 对中的四对：

$$P(\\text{和} = 9) = \\frac{4}{36} = \\frac{1}{9}.$$

用和为 $s$ 的数对个数公式 $6 - |s - 7|$ 检验：$6 - |9 - 7| = 4$。

> **注意。** 和共有 $11$ 种，但 $P(\\text{和} = 9)$ 不是 $\\frac{1}{11}$：各个和并不等可能。要除以 $36$ 个数对，并且 $(4, 5)$ 与 $(5, 4)$ 要分开数。`,
      ),
      generate(rng) {
        const kind = rng.pick(["sum", "sum", "atMost", "atLeast", "not"] as const);
        const s = kind === "atMost" ? rng.int(3, 6) : kind === "atLeast" ? rng.int(8, 12) : rng.int(2, 12);
        const sums =
          kind === "atMost" ? range(2, s) : kind === "atLeast" ? range(s, 12) : kind === "not" ? range(2, 12).filter((v) => v !== s) : [s];
        const n = sum(sums.map(diceSum));
        const event = {
          sum: t(`the sum is ${s}`, `点数和为 ${s}`),
          atMost: t(`the sum is at most ${s}`, `点数和不大于 ${s}`),
          atLeast: t(`the sum is at least ${s}`, `点数和不小于 ${s}`),
          not: t(`the sum is not ${s}`, `点数和不为 ${s}`),
        }[kind];
        const has = (a: number, b: number) => sums.includes(a + b);
        const count: Text =
          kind === "not"
            ? t(
                `It is quicker to count the pairs with sum $${s}$, the unshaded cells: $6 - |${s} - 7| = ${diceSum(s)}$. The rest are shaded: $36 - ${diceSum(s)} = ${n}$.`,
                `数和为 $${s}$ 的数对（没有阴影的格子）更快：$6 - |${s} - 7| = ${diceSum(s)}$。其余都涂了阴影：$36 - ${diceSum(s)} = ${n}$。`,
              )
            : kind === "sum"
              ? t(
                  `The shaded cells lie on one diagonal: $6 - |${s} - 7| = ${n}$ pairs.`,
                  `阴影格子在一条对角线上：$6 - |${s} - 7| = ${n}$ 对。`,
                )
              : t(
                  `Count the shaded cells sum by sum, using $6 - |v - 7|$ pairs for the sum $v$: $${sumCounts(sums)}$, so $${plus(sums.map(diceSum))}$ pairs.`,
                  `按和逐个数阴影格子，和为 $v$ 的有 $6 - |v - 7|$ 对：$${sumCounts(sums)}$，所以共 $${plus(sums.map(diceSum))}$ 对。`,
                );
        const listedPairs = sums.flatMap((v) =>
          range(1, 6)
            .filter((a) => v - a >= 1 && v - a <= 6)
            .map((a) => `(${a}, ${v - a})`),
        );
        const check: Text =
          kind === "not"
            ? t(
                `**Check.** The event and "the sum is $${s}$" share all $36$ pairs: $\\frac{${n}}{36} + \\frac{${diceSum(s)}}{36} = 1$.`,
                `**检验。** 这个事件与“和为 $${s}$”分享全部 $36$ 对：$\\frac{${n}}{36} + \\frac{${diceSum(s)}}{36} = 1$。`,
              )
            : t(
                `**Check.** Listing the pairs gives the same count: $${listedPairs.join(", ")}$, which is $${n}$ pairs.`,
                `**检验。** 列出数对，个数相同：$${listedPairs.join(", ")}$，共 $${n}$ 对。`,
              );
        return {
          ...probProblem(
            t(
              `Two six-sided dice are rolled. What is the probability that ${event.en}?`,
              `掷两枚六面骰子。${event["zh-CN"]}的概率是多少？`,
            ),
            Q.of(n, 36),
            t(
              `${stepLabel(1, "shade the event in the grid of sums", "在和的方格中画出事件").en} Each of the $36$ cells is an equally likely pair; shade those where ${event.en}:

{{figure 0}}

${stepLabel(2, "count", "计数").en} ${count.en}

${stepLabel(3, "divide", "相除").en}${steps(`P = ${ratio(n, 36)}`)}${check.en}`,
              `${stepLabel(1, "shade the event in the grid of sums", "在和的方格中画出事件")["zh-CN"]}$36$ 个格子中每个都是等可能的数对；把${event["zh-CN"]}的格子涂上阴影：

{{figure 0}}

${stepLabel(2, "count", "计数")["zh-CN"]}${count["zh-CN"]}

${stepLabel(3, "divide", "相除")["zh-CN"]}${steps(`P = ${ratio(n, 36)}`)}${check["zh-CN"]}`,
            ),
            [Q.of(1, 11), Q.of(sums.length, 11), Q.of(n, 12), Q.of(sum(sums.map((v) => Math.ceil(diceSum(v) / 2))), 21)],
          ),
          solutionFigures: [
            diceFigure((a, b) => a + b, has, `the sum, with the cells where ${event.en} shaded`, `点数和，${event["zh-CN"]}的格子涂上阴影`),
          ],
        };
      },
    },
  ],
};

/** groupCheck checks an expected count by groups: in every d trials, a are expected, so g groups give g × a. */
function groupCheck(p: Q, trialsN: number): Text {
  const [a, d] = [Number(p.n), Number(p.d)];
  const g = trialsN / d;
  return t(
    `**Check.** Think of the $${trialsN}$ trials as $${trialsN} \\div ${d} = ${g}$ groups of $${d}$. In each group of $${d}$, about $${a}$ go this way, so in all $${g} \\times ${a} = ${g * a}$.`,
    `**检验。** 把 $${trialsN}$ 次试验看成 $${trialsN} \\div ${d} = ${g}$ 组，每组 $${d}$ 次。每组中约有 $${a}$ 次出现这个结果，所以共 $${g} \\times ${a} = ${g * a}$ 次。`,
  );
}

/** predictionsIntro draws a die's six faces with the six shaded. */
const predictionsIntro: Figure = stripFigure(
  range(1, 6),
  (x) => x === 6,
  "The six faces of a die, with the face 6 shaded: one of six equally likely outcomes.",
  "骰子的六个面，其中 6 点涂上阴影：六个等可能结果之一。",
);

/** usingProbabilityToMakePredictions is outline topic 6.16.7. */
export const usingProbabilityToMakePredictions: TopicDef = {
  id: "using-probability-to-make-predictions",
  title: t("Using Probability to Make Predictions", "用概率进行预测"),
  summary: t(
    "Predict how often an event will occur in repeated trials from its theoretical probability.",
    "由理论概率预测事件在重复试验中发生的次数。",
  ),
  prerequisites: ["single-events-in-probability", "using-experimental-probability-to-make-predictions"],
  encompasses: [
    { topic: "single-events-in-probability", weight: 0.5 },
    { topic: "using-experimental-probability-to-make-predictions", weight: 0.4 },
  ],
  xp: 10,
  standards: ["CCSS.7.SP.C.6", "CCSS.7.SP.C.7.A"],
  intro: t(
    `From an experiment, we predicted future counts by taking the same share of the new trials. A probability worked out from equally likely outcomes, a **theoretical probability**, predicts in exactly the same way, and needs no experiment first.

A fair die shows a six on one of its six faces:

{{figure 0}}

So $P(6) = \\frac{1}{6}$, and in $120$ rolls we expect about

$$\\frac{1}{6} \\times 120 = 20$$

sixes: one in every six rolls, and $120$ rolls make $20$ groups of six. A coin flipped $50$ times is expected to land heads about $\\frac{1}{2} \\times 50 = 25$ times in the same way. The real counts will scatter around these numbers, but over many trials they stay close in proportion. In this lesson we predict counts from probabilities, and work backward to the number of trials needed.`,
    `由试验得到概率后，我们在新的试验中取同样的比例来预测次数。由等可能结果算出的概率，即**理论概率**，也用完全相同的方法预测，而且不需要先做试验。

一枚均匀的骰子六个面中有一个是六点：

{{figure 0}}

所以 $P(6) = \\frac{1}{6}$，掷 $120$ 次，预计六点出现约

$$\\frac{1}{6} \\times 120 = 20$$

次：每六次中出现一次，$120$ 次就是 $20$ 组六次。同样，一枚硬币抛 $50$ 次，预计正面朝上约 $\\frac{1}{2} \\times 50 = 25$ 次。实际次数会在这些数附近波动，但试验次数多了，比例会很接近。这节课我们由概率预测次数，并反过来求所需的试验次数。`,
  ),
  introFigures: [predictionsIntro],
  knowledgePoints: [
    {
      id: "expected-number-of-times",
      title: t("The expected number of times", "预期次数"),
      explanation: t(
        `If an event has probability $P$, it happens in about that share of the trials, so in $n$ trials we expect it about

$$P \\times n$$

times. This is the same calculation as for experimental probability, with the probability found from equally likely outcomes instead.

A die is rolled $90$ times. A number greater than $4$ means $5$ or $6$, so $P = \\frac{2}{6} = \\frac{1}{3}$, and we expect it about $\\frac{1}{3} \\times 90 = 30$ times. In groups: every $3$ rolls give about one such number, and $90$ rolls are $30$ groups of $3$.

> **Watch out.** Multiply by the probability of the event asked about, not of its complement: $\\frac{2}{3} \\times 90 = 60$ counts the numbers that are **not** greater than $4$. And the number of outcomes in the event, $2$, is not the expected count; it must become a probability first.`,
        `如果事件的概率是 $P$，它大约在这个比例的试验中发生，所以在 $n$ 次试验中，预计它发生约

$$P \\times n$$

次。这与试验概率的计算相同，只是概率改由等可能结果求出。

掷骰子 $90$ 次。大于 $4$ 的数是 $5$ 或 $6$，所以 $P = \\frac{2}{6} = \\frac{1}{3}$，预计约出现 $\\frac{1}{3} \\times 90 = 30$ 次。分组来看：每 $3$ 次约出现一次，$90$ 次是 $30$ 组 $3$ 次。

> **注意。** 要乘所问事件的概率，而不是它的对立事件的概率：$\\frac{2}{3} \\times 90 = 60$ 数的是**不**大于 $4$ 的次数。事件包含的结果数 $2$ 也不是预期次数，要先化成概率。`,
      ),
      generate(rng) {
        for (;;) {
          const useDie = rng.bool();
          const n = useDie ? 6 : rng.pick([8, 10, 12, 20]);
          const e = numberEvent(rng, n);
          const ev = range(1, n).filter(e.test);
          if (ev.length === 0 || ev.length === n) continue;
          const p = Q.of(ev.length, n);
          const trialsN = Number(p.d) * rng.int(3, 40);
          const answer = p.mul(Q.of(trialsN));
          const what = useDie
            ? t(`A fair six-sided die is rolled ${trialsN} times`, `一枚均匀的六面骰子掷 ${trialsN} 次`)
            : t(
                `A card is drawn from ${n} cards numbered 1 to ${n} and put back, ${trialsN} times`,
                `从编号 1 到 ${n} 的 ${n} 张卡片中有放回地抽卡 ${trialsN} 次`,
              );
          return {
            ...numberProblem({
              prompt: t(
                `${what.en}. How many times can you expect the number to be ${e.en}?`,
                `${what["zh-CN"]}。预计这个数${e.zh}的次数是多少？`,
              ),
              answer,
              form: "integer",
              wrong: [Q.of(n - ev.length, n).mul(Q.of(trialsN)), ev.length, Q.of(trialsN, n)],
              solution: t(
                `${stepLabel(1, "the probability of one trial", "一次试验的概率").en} Of the $${n}$ equally likely outcomes, those that are ${e.en} are shaded:

{{figure 0}}

That is $${ev.length}$ of them, so $P = ${ratio(ev.length, n)}$.

${stepLabel(2, "multiply by the number of trials", "乘以试验次数").en}${steps(`${p.toLatex()} \\times ${trialsN} = ${answer.toLatex()}`)}${groupCheck(p, trialsN).en}`,
                `${stepLabel(1, "the probability of one trial", "一次试验的概率")["zh-CN"]}在 $${n}$ 个等可能结果中，${e.zh}的涂上阴影：

{{figure 0}}

共 $${ev.length}$ 个，所以 $P = ${ratio(ev.length, n)}$。

${stepLabel(2, "multiply by the number of trials", "乘以试验次数")["zh-CN"]}${steps(`${p.toLatex()} \\times ${trialsN} = ${answer.toLatex()}`)}${groupCheck(p, trialsN)["zh-CN"]}`,
              ),
            }),
            solutionFigures: [
              stripFigure(
                range(1, n),
                e.test,
                `The outcomes 1 to ${n}, with those that are ${e.en} shaded.`,
                `结果 1 到 ${n}，其中${e.zh}的涂上阴影。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "predictions-with-spinners-and-bags",
      title: t("Spinners and bags", "转盘与摸球"),
      explanation: t(
        `The same rule applies to spinners with equal sections and to drawing with replacement. Putting the marble back matters: the bag is the same for every draw, so every trial has the same probability. Find the probability of one trial, then multiply by the number of trials.

A spinner has $10$ equal sections, $4$ of them blue, so $P(\\text{blue}) = \\frac{4}{10} = \\frac{2}{5}$. In $150$ spins we expect blue about $\\frac{2}{5} \\times 150 = 60$ times: $150$ spins are $30$ groups of $5$, each giving about $2$ blues.

> **Watch out.** The probability is blue sections over **all** sections, $\\frac{4}{10}$, not blue over the other colors, $\\frac{4}{6}$. And dividing the spins by the number of sections, $150 \\div 10 = 15$, gives the count for one section, not for all the blue ones.`,
        `同样的方法适用于等分转盘和有放回地摸球。“放回”很重要：每次摸球时袋子都一样，所以每次试验的概率相同。先求一次试验的概率，再乘以试验次数。

一个转盘有 $10$ 个相等的扇区，其中 $4$ 个是蓝色，所以 $P(\\text{蓝}) = \\frac{4}{10} = \\frac{2}{5}$。转 $150$ 次，预计蓝色出现约 $\\frac{2}{5} \\times 150 = 60$ 次：$150$ 次是 $30$ 组 $5$ 次，每组约出现 $2$ 次蓝色。

> **注意。** 概率是蓝色扇区数除以**全部**扇区数 $\\frac{4}{10}$，而不是蓝色比其他颜色 $\\frac{4}{6}$。用转动次数除以扇区数，$150 \\div 10 = 15$，只是一个扇区的次数，而不是全部蓝色扇区的次数。`,
      ),
      generate(rng) {
        const spinning = rng.bool();
        const [c, cz] = rng.pick(colors);
        const total = spinning ? rng.pick([4, 5, 6, 8, 10, 12]) : rng.int(5, 20);
        const k = rng.int(1, total - 1);
        const p = Q.of(k, total);
        const n = Number(p.d) * rng.int(4, 40);
        const answer = p.mul(Q.of(n));
        const thing = spinning ? t("sections", "扇区") : t("marbles", "球");
        return {
          ...numberProblem({
            prompt: spinning
              ? t(
                  `A spinner has ${total} equal sections, ${k} of which are ${c}. It is spun ${n} times. How many times can you expect it to land on ${c}?`,
                  `一个转盘有 ${total} 个相等的扇区，其中 ${k} 个是${cz}色。转 ${n} 次，预计停在${cz}色的次数是多少？`,
                )
              : t(
                  `A bag holds ${total} marbles, ${k} of which are ${c}. A marble is drawn and put back ${n} times. How many times can you expect to draw a ${c} marble?`,
                  `袋中有 ${total} 个球，其中 ${k} 个是${cz}球。有放回地摸球 ${n} 次，预计摸到${cz}球的次数是多少？`,
                ),
            answer,
            form: "integer",
            wrong: [Q.of(total - k, total).mul(Q.of(n)), Q.of(k, total - k).mul(Q.of(n)), Q.of(n, total)],
            solution: t(
              `${stepLabel(1, "the probability of one trial", "一次试验的概率").en} $${k}$ of the $${total}$ equally likely ${thing.en} are ${c}, shaded below:

{{figure 0}}${steps(`P = ${ratio(k, total)}`)}${stepLabel(2, "multiply by the number of trials", "乘以试验次数").en} ${spinning ? "Every spin" : "Since the marble is put back, every draw"} has this same probability:${steps(`${p.toLatex()} \\times ${n} = ${answer.toLatex()}`)}${groupCheck(p, n).en}`,
              `${stepLabel(1, "the probability of one trial", "一次试验的概率")["zh-CN"]}$${total}$ 个等可能的${thing["zh-CN"]}中有 $${k}$ 个是${cz}色（下图阴影）：

{{figure 0}}${steps(`P = ${ratio(k, total)}`)}${stepLabel(2, "multiply by the number of trials", "乘以试验次数")["zh-CN"]}${spinning ? "每次转动" : "因为摸后放回，每次摸球"}的概率都相同：${steps(`${p.toLatex()} \\times ${n} = ${answer.toLatex()}`)}${groupCheck(p, n)["zh-CN"]}`,
            ),
          }),
          solutionFigures: [
            spinning
              ? {
                  svg: spinner(total, k),
                  alt: t(
                    `A spinner of ${total} equal sections, ${k} of them shaded.`,
                    `有 ${total} 个相等扇区的转盘，其中 ${k} 个涂上阴影。`,
                  ),
                }
              : bagFigure(
                  [k, total - k],
                  0,
                  `The ${total} marbles, with the ${k} ${c} ones shaded.`,
                  `${total} 个球，其中 ${k} 个${cz}球涂上阴影。`,
                ),
          ],
        };
      },
    },
    {
      id: "trials-needed",
      title: t("How many trials", "需要多少次试验"),
      explanation: t(
        `Working backward, the expected count $m$ is $P \\times n$, and now $n$ is unknown. Undo the multiplication by dividing:

$$n = m \\div P$$

A spinner lands on red with probability $\\frac{2}{5}$. To expect red $14$ times, spin about $14 \\div \\frac{2}{5} = 14 \\times \\frac{5}{2} = 35$ times. In groups: every $5$ spins give about $2$ reds, so $14$ reds need $7$ groups of $5$, which is $35$ spins. Check: $\\frac{2}{5} \\times 35 = 14$.

> **Watch out.** Divide by the probability; do not multiply: $\\frac{2}{5} \\times 14$ is less than $14$, but more trials than successes are needed. Dividing by a fraction means multiplying by its reciprocal.`,
        `反过来，预期次数 $m = P \\times n$，现在 $n$ 未知。用除法撤销乘法：

$$n = m \\div P$$

一个转盘停在红色的概率是 $\\frac{2}{5}$。要预计出现 $14$ 次红色，大约要转 $14 \\div \\frac{2}{5} = 14 \\times \\frac{5}{2} = 35$ 次。分组来看：每 $5$ 次约出现 $2$ 次红色，所以 $14$ 次红色需要 $7$ 组 $5$ 次，即 $35$ 次。检验：$\\frac{2}{5} \\times 35 = 14$。

> **注意。** 要除以概率，不是乘以概率：$\\frac{2}{5} \\times 14$ 比 $14$ 还小，可是试验次数一定比成功次数多。除以一个分数就是乘以它的倒数。`,
      ),
      generate(rng) {
        const total = rng.pick([4, 5, 6, 8, 10, 12]);
        const k = rng.int(1, total - 1);
        const p = Q.of(k, total);
        const m = Number(p.n) * rng.int(2, 25);
        const answer = Q.of(m).div(p);
        const [c, cz] = rng.pick(colors);
        const recip = Q.one.div(p);
        return {
          ...numberProblem({
            prompt: t(
              `A spinner has ${total} equal sections, ${k} of which are ${c}. About how many spins are needed to expect it to land on ${c} ${m} times?`,
              `一个转盘有 ${total} 个相等的扇区，其中 ${k} 个是${cz}色。大约要转多少次，才能预计停在${cz}色 ${m} 次？`,
            ),
            answer,
            form: "integer",
            wrong: [p.mul(Q.of(m)), m * total, m * k],
            solution: t(
              `${stepLabel(1, "the probability of one spin", "一次转动的概率").en} $${k}$ of the $${total}$ equal sections are ${c}:

{{figure 0}}${steps(`P = ${ratio(k, total)}`)}${stepLabel(2, "undo the multiplication", "撤销乘法").en} The expected count is $P \\times n = ${m}$, so divide by $P$, that is, multiply by its reciprocal $${recip.toLatex()}$:${steps(`n = ${m} \\div ${p.toLatex()} = ${m} \\times ${recip.toLatex()} = ${answer.toLatex()}`)}**Check.** Multiply back: $${p.toLatex()} \\times ${answer.toLatex()} = ${m}$, the count we wanted, and $${answer.toLatex()}$ spins is more than $${m}$, as it must be.`,
              `${stepLabel(1, "the probability of one spin", "一次转动的概率")["zh-CN"]}$${total}$ 个相等的扇区中有 $${k}$ 个是${cz}色：

{{figure 0}}${steps(`P = ${ratio(k, total)}`)}${stepLabel(2, "undo the multiplication", "撤销乘法")["zh-CN"]}预期次数 $P \\times n = ${m}$，所以除以 $P$，即乘以它的倒数 $${recip.toLatex()}$：${steps(`n = ${m} \\div ${p.toLatex()} = ${m} \\times ${recip.toLatex()} = ${answer.toLatex()}`)}**检验。** 乘回去：$${p.toLatex()} \\times ${answer.toLatex()} = ${m}$，正是想要的次数；并且 $${answer.toLatex()}$ 次比 $${m}$ 次多，这是必然的。`,
            ),
          }),
          solutionFigures: [
            {
              svg: spinner(total, k),
              alt: t(`A spinner of ${total} equal sections, ${k} of them shaded.`, `有 ${total} 个相等扇区的转盘，其中 ${k} 个涂上阴影。`),
            },
          ],
        };
      },
    },
  ],
};

/** complementFigure draws the sample space twice, once with A shaded and once with A' shaded. */
const complementFigure = (s: readonly number[], a: readonly number[], en: string, zh: string): Figure => ({
  svg: strips(s, [
    { name: "A", has: (x) => a.includes(x) },
    { name: "A'", has: (x) => !a.includes(x) },
  ]),
  alt: t(en, zh),
});

/** complementIntro draws 1 to 10 with the primes shaded, and again with the rest shaded. */
const complementIntro: Figure = complementFigure(
  range(1, 10),
  [2, 3, 5, 7],
  "The numbers 1 to 10 drawn twice: in row A the primes 2, 3, 5, 7 are shaded; in row A' the other numbers 1, 4, 6, 8, 9, 10 are shaded.",
  "1 到 10 画两行：A 行中质数 2、3、5、7 涂上阴影；A' 行中其余的数 1、4、6、8、9、10 涂上阴影。",
);

/** splitFigure draws the interval from 0 to 1 split into P(A) and P(A'). */
const splitFigure = (p: Q, en: string, zh: string): Figure => ({ svg: splitScale(p, "P(A)", "P(A')"), alt: t(en, zh) });

/** theComplementOfAnEvent is outline topic 6.16.8. */
export const theComplementOfAnEvent: TopicDef = {
  id: "the-complement-of-an-event",
  title: t("The Complement of an Event", "对立事件"),
  summary: t("Find the complement of an event and use P(A') = 1 − P(A).", "求事件的对立事件，并使用 P(A') = 1 − P(A)。"),
  prerequisites: ["single-events-in-probability"],
  encompasses: [{ topic: "single-events-in-probability", weight: 0.4 }],
  xp: 10,
  standards: ["CCSS.HSS.CP.A.1"],
  intro: t(
    `Every outcome of an experiment either makes an event happen or does not. The outcomes where it does not happen form an event of their own, the **complement**, and knowing one of the two tells you the other.

Draw a number from $1$ to $10$, and let $A$ be "the number is prime". Row $A$ shades its outcomes, row $A'$ the rest:

{{figure 0}}

Between them the two rows shade every number exactly once: $A = \\{2, 3, 5, 7\\}$ and $A' = \\{1, 4, 6, 8, 9, 10\\}$, with $4 + 6 = 10$ outcomes. So their probabilities, $\\frac{4}{10}$ and $\\frac{6}{10}$, add to $\\frac{10}{10} = 1$. This is often the quick way to a probability: when "not $A$" is hard to count, find $P(A)$ and subtract it from $1$. In this lesson we list complements, use $P(A') = 1 - P(A)$, and apply it to questions with "not".`,
    `试验的每个结果要么使事件发生，要么不使它发生。使事件不发生的那些结果组成另一个事件，叫做**对立事件**；知道其中一个，就知道另一个。

从 $1$ 到 $10$ 中抽一个数，设 $A$ 为“这个数是质数”。$A$ 行把它的结果涂上阴影，$A'$ 行把其余的涂上阴影：

{{figure 0}}

两行合起来，每个数恰好被涂一次：$A = \\{2, 3, 5, 7\\}$，$A' = \\{1, 4, 6, 8, 9, 10\\}$，共 $4 + 6 = 10$ 个结果。所以它们的概率 $\\frac{4}{10}$ 与 $\\frac{6}{10}$ 之和是 $\\frac{10}{10} = 1$。这常常是求概率的捷径：“非 $A$”不好数时，先求 $P(A)$，再用 $1$ 去减。这节课我们列出对立事件，使用 $P(A') = 1 - P(A)$，并解决带“不”的问题。`,
  ),
  introFigures: [complementIntro],
  knowledgePoints: [
    {
      id: "the-complement-as-a-set",
      title: t("The complement as a set", "对立事件的集合"),
      explanation: t(
        `The **complement** of an event $A$, written $A'$, is the event that $A$ does **not** happen: the outcomes of the sample space $S$ that are not in $A$. Every outcome is in exactly one of $A$ and $A'$, so to list $A'$, go through $S$ and keep what $A$ leaves out.

Rolling a die, $S = \\{1, 2, 3, 4, 5, 6\\}$. If $A = \\{1, 2\\}$ is "less than $3$", then $A' = \\{3, 4, 5, 6\\}$ is "at least $3$". As a check, $2 + 4 = 6$ outcomes: none is missed and none is counted twice.

> **Watch out.** $A'$ depends on the sample space: it is everything in $S$ outside $A$, not $A$ itself, and not just one or two other outcomes. The complement of "less than $3$" is "at least $3$", which includes $3$.`,
        `事件 $A$ 的**对立事件**（补集）记作 $A'$，表示 $A$ **不**发生：样本空间 $S$ 中不在 $A$ 里的结果。每个结果恰好属于 $A$ 与 $A'$ 中的一个，所以要列出 $A'$，就查遍 $S$，保留 $A$ 没有包含的结果。

掷骰子，$S = \\{1, 2, 3, 4, 5, 6\\}$。若 $A = \\{1, 2\\}$ 表示“小于 $3$”，则 $A' = \\{3, 4, 5, 6\\}$ 表示“不小于 $3$”。检验：$2 + 4 = 6$ 个结果，没有遗漏，也没有重复。

> **注意。** $A'$ 取决于样本空间：它是 $S$ 中 $A$ 之外的全部结果，不是 $A$ 本身，也不只是另外一两个结果。“小于 $3$”的对立事件是“不小于 $3$”，其中包含 $3$。`,
      ),
      generate(rng) {
        const n = rng.int(6, 14);
        const s = range(1, n);
        const listedA = rng.bool();
        for (;;) {
          const e = numberEvent(rng, n);
          const a = listedA ? unique(rng.sample(s, rng.int(2, n - 2))) : s.filter(e.test);
          if (a.length === 0 || a.length === n) continue;
          const comp = s.filter((x) => !a.includes(x));
          const def = listedA
            ? t(`$A = ${setTex(a)}$`, `$A = ${setTex(a)}$`)
            : t(`$A$ is the event that the number is ${e.en}`, `事件 $A$ 表示这个数${e.zh}`);
          return {
            ...setProblem({
              prompt: t(
                `A number is chosen from the sample space $S = \\{1, 2, \\ldots, ${n}\\}$, and ${def.en}. List the outcomes of $A'$.${SET_EN}`,
                `从样本空间 $S = \\{1, 2, \\ldots, ${n}\\}$ 中选一个数，${def["zh-CN"]}。列出 $A'$ 包含的结果。${SET_ZH}`,
              ),
              values: comp,
              wrong: [a, ...(listedA ? [] : [s.filter((x) => !e.loose(x))])],
              solution: t(
                `${stepLabel(1, "the outcomes of A", "A 的结果").en} ${listedA ? `$A = ${setTex(a)}$ is given.` : `The numbers from $1$ to $${n}$ that are ${e.en}: $A = ${setTex(a)}$.`}

${stepLabel(2, "keep everything else", "保留其余的结果").en} $A'$ holds every outcome of $S$ not in $A$. Row $A$ shades $A$, row $A'$ the rest:

{{figure 0}}${steps(`A' = ${setTex(comp)}`)}**Check.** Each number is shaded in exactly one row, and $n(A) + n(A') = ${a.length} + ${comp.length} = ${n}$, the size of $S$.`,
                `${stepLabel(1, "the outcomes of A", "A 的结果")["zh-CN"]}${listedA ? `已知 $A = ${setTex(a)}$。` : `$1$ 到 $${n}$ 中${e.zh}的数：$A = ${setTex(a)}$。`}

${stepLabel(2, "keep everything else", "保留其余的结果")["zh-CN"]}$A'$ 由 $S$ 中不在 $A$ 里的所有结果组成。$A$ 行涂出 $A$，$A'$ 行涂出其余的数：

{{figure 0}}${steps(`A' = ${setTex(comp)}`)}**检验。** 每个数恰好在一行中涂上阴影，$n(A) + n(A') = ${a.length} + ${comp.length} = ${n}$，正是 $S$ 的大小。`,
              ),
            }),
            solutionFigures: [
              complementFigure(
                s,
                a,
                `The numbers 1 to ${n} drawn twice: row A shades ${a.join(", ")}; row A' shades ${comp.join(", ")}.`,
                `1 到 ${n} 画两行：A 行涂出 ${a.join("、")}；A' 行涂出 ${comp.join("、")}。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "probability-of-the-complement",
      title: t("The probability of the complement", "对立事件的概率"),
      explanation: t(
        `An event and its complement split the outcomes between them, with nothing left over and nothing shared. So their probabilities split the whole probability, $1$, between them:

$$P(A) + P(A') = 1, \\qquad P(A') = 1 - P(A).$$

On the scale from $0$ to $1$, $P(A)$ and $P(A')$ are the two pieces of one bar. If the probability of snow is $0.28$, the probability of no snow is $1 - 0.28 = 0.72$. If $P(A) = \\frac{5}{12}$, then $P(A') = \\frac{12}{12} - \\frac{5}{12} = \\frac{7}{12}$.

> **Watch out.** Subtract from $1$; do not take the reciprocal: the complement of $\\frac{5}{12}$ is not $\\frac{12}{5}$, which is more than $1$ and so is no probability at all. And with decimals, line up the places: $1 - 0.28 = 0.72$, not $0.82$.`,
        `事件与它的对立事件把全部结果分成两份，既没有剩余，也没有重叠。所以它们的概率把整个概率 $1$ 分成两份：

$$P(A) + P(A') = 1, \\qquad P(A') = 1 - P(A).$$

在 $0$ 到 $1$ 的刻度上，$P(A)$ 与 $P(A')$ 是同一长条的两段。下雪的概率是 $0.28$，不下雪的概率就是 $1 - 0.28 = 0.72$。若 $P(A) = \\frac{5}{12}$，则 $P(A') = \\frac{12}{12} - \\frac{5}{12} = \\frac{7}{12}$。

> **注意。** 要用 $1$ 去减，不是取倒数：$\\frac{5}{12}$ 的对立事件的概率不是 $\\frac{12}{5}$，它大于 $1$，根本不是概率。小数相减时要对齐数位：$1 - 0.28 = 0.72$，不是 $0.82$。`,
      ),
      generate(rng) {
        const decimal = rng.bool();
        const p = decimal ? Q.of(rng.int(1, 99), 100) : Q.of(rng.int(1, 19), 20).add(Q.zero);
        const pv = decimal ? p : Q.of(rng.int(1, 11), 12).mul(Q.one);
        const [en, zh] = rng.pick([
          ["it rains tomorrow", "明天下雨"],
          ["a randomly chosen phone is faulty", "随机选的一部手机有故障"],
          ["the team wins its next game", "球队赢下一场比赛"],
          ["a randomly chosen student wears glasses", "随机选的一名学生戴眼镜"],
          ["the train is on time", "火车准点"],
        ] as const);
        const shown = decimal ? dec(pv) : pv.toLatex();
        const answer = Q.one.sub(pv);
        const ans = decimal ? dec(answer) : answer.toLatex();
        const oneAs = decimal ? "1" : `\\frac{${pv.d}}{${pv.d}}`;
        return {
          ...probProblem(
            t(
              `The probability that ${en} is $${shown}$. What is the probability that this does not happen?`,
              `${zh}的概率是 $${shown}$。这件事不发生的概率是多少？`,
            ),
            answer,
            t(
              `${stepLabel(1, "name the complement", "找出对立事件").en} Let $A$ be the event that ${en}. "It does not happen" is $A'$: every time, exactly one of $A$ and $A'$ happens, so the two probabilities fill the scale from $0$ to $1$:

{{figure 0}}

${stepLabel(2, "subtract from 1", "用 1 去减").en}${steps(`P(A') = ${decimal ? "1" : oneAs} - ${shown} = ${ans}`)}**Check.** Add back: $${shown} + ${ans} = 1$. Both lie between $0$ and $1$, and the larger of the two belongs to the ${pv.cmp(answer) > 0 ? "event" : pv.cmp(answer) < 0 ? "complement" : "neither: they are equal"}${pv.cmp(answer) === 0 ? "" : ", as the bar shows"}.`,
              `${stepLabel(1, "name the complement", "找出对立事件")["zh-CN"]}设事件 $A$ 为${zh}。“这件事不发生”就是 $A'$：每次恰好有 $A$ 与 $A'$ 中的一个发生，所以两个概率填满从 $0$ 到 $1$ 的刻度：

{{figure 0}}

${stepLabel(2, "subtract from 1", "用 1 去减")["zh-CN"]}${steps(`P(A') = ${decimal ? "1" : oneAs} - ${shown} = ${ans}`)}**检验。** 加回去：$${shown} + ${ans} = 1$。两者都在 $0$ 与 $1$ 之间，${pv.cmp(answer) > 0 ? "较大的是事件本身" : pv.cmp(answer) < 0 ? "较大的是对立事件" : "两者相等"}${pv.cmp(answer) === 0 ? "" : "，与长条一致"}。`,
            ),
            [pv, Q.one.div(pv), Q.one.sub(pv).sub(Q.of(1, 10))],
          ),
          solutionFigures: [
            splitFigure(
              pv,
              `The interval from 0 to 1 split into P(A) = ${shown.replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")}, shaded, and P(A') = ${ans.replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")}.`,
              `从 0 到 1 的区间分成 P(A) = ${shown.replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")}（阴影）和 P(A') = ${ans.replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")}。`,
            ),
          ],
        };
      },
    },
    {
      id: "complements-in-context",
      title: t("Complements in context", "实际问题中的对立事件"),
      explanation: t(
        `"Not" an outcome is the complement of that outcome. There are two routes to its probability: count all the other outcomes directly, or find the probability of the outcome itself and subtract from $1$. The second is quicker when there are many other kinds, and the first makes a good check.

A box holds $5$ apple, $7$ pear and $8$ plum sweets, $20$ in all. $P(\\text{not pear}) = 1 - \\frac{7}{20} = \\frac{13}{20}$, the same as counting the $5 + 8 = 13$ sweets that are not pear.

> **Watch out.** $1 - P(\\text{pear})$ is the answer; $P(\\text{pear})$ itself is the probability of the opposite. And "not pear" is not one other kind: it includes **every** kind but pear, so all of them are counted.`,
        `“不是”某个结果就是这个结果的对立事件。求它的概率有两条路：直接数出其余的所有结果；或者先求这个结果本身的概率，再用 $1$ 去减。其余种类很多时第二条路更快，第一条路正好用来检验。

一盒糖中有 $5$ 颗苹果味、$7$ 颗梨味、$8$ 颗李子味，共 $20$ 颗。$P(\\text{不是梨味}) = 1 - \\frac{7}{20} = \\frac{13}{20}$，与数出 $5 + 8 = 13$ 颗非梨味的结果相同。

> **注意。** 答案是 $1 - P(\\text{梨味})$；$P(\\text{梨味})$ 本身是相反事件的概率。“不是梨味”也不只是另外某一种：它包括除梨味外的**所有**种类，都要算上。`,
      ),
      generate(rng) {
        const cs = rng.sample(colors, rng.int(3, 4));
        const f = cs.map(() => rng.int(1, 15));
        const i = rng.int(0, cs.length - 1);
        const total = sum(f);
        const k = total - f[i]!;
        const others = f.filter((_, j) => j !== i);
        const bag = (lang: 0 | 1) =>
          cs.map((c, j) => (lang === 0 ? `${f[j]} ${c[0]}` : `${f[j]} 个${c[1]}球`)).join(lang === 0 ? ", " : "、");
        return {
          ...probProblem(
            t(
              `A bag holds ${bag(0)} marbles. One marble is drawn at random. What is the probability that it is not ${cs[i]![0]}?`,
              `袋中有${bag(1)}。随机摸出一个球，摸到的不是${cs[i]![1]}球的概率是多少？`,
            ),
            Q.of(k, total),
            t(
              `${stepLabel(1, "the probability of the outcome itself", "这个结果本身的概率").en} There are $${plus(f)}$ marbles, and $${f[i]}$ are ${cs[i]![0]}:${steps(`P(\\text{${cs[i]![0]}}) = \\frac{${f[i]}}{${total}}`)}${stepLabel(2, "subtract from 1", "用 1 去减").en} "Not ${cs[i]![0]}" is the complement, the shaded marbles below:

{{figure 0}}${steps(`P(\\text{not ${cs[i]![0]}}) = 1 - \\frac{${f[i]}}{${total}} = ${ratio(k, total)}`)}**Check.** Count the shaded marbles directly: $${plus(others)}$ of the $${total}$ are not ${cs[i]![0]}, which gives $\\frac{${k}}{${total}}$ again.`,
              `${stepLabel(1, "the probability of the outcome itself", "这个结果本身的概率")["zh-CN"]}共有 $${plus(f)}$ 个球，其中 $${f[i]}$ 个是${cs[i]![1]}球：${steps(`P(\\text{${cs[i]![1]}}) = \\frac{${f[i]}}{${total}}`)}${stepLabel(2, "subtract from 1", "用 1 去减")["zh-CN"]}“不是${cs[i]![1]}球”是对立事件，即下图中涂上阴影的球：

{{figure 0}}${steps(`P(\\text{不是${cs[i]![1]}}) = 1 - \\frac{${f[i]}}{${total}} = ${ratio(k, total)}`)}**检验。** 直接数阴影的球：$${total}$ 个中有 $${plus(others)}$ 个不是${cs[i]![1]}球，同样得到 $\\frac{${k}}{${total}}$。`,
            ),
            [Q.of(f[i]!, total), Q.of(k, f[i]!), Q.of(cs.length - 1, cs.length)],
          ),
          solutionFigures: [
            {
              svg: marbles(f, (j) => j !== i),
              alt: t(
                `The ${total} marbles, with the ${k} that are not ${cs[i]![0]} shaded.`,
                `${total} 个球，其中不是${cs[i]![1]}球的 ${k} 个涂上阴影。`,
              ),
            },
          ],
        };
      },
    },
  ],
};

/** regionNames name the four regions of a two-set Venn diagram, in Venn2 order. */
const regionNames: readonly Text[] = [
  t("inside $A$ but outside $B$", "在 $A$ 内但在 $B$ 外"),
  t("inside both $A$ and $B$", "同时在 $A$ 和 $B$ 内"),
  t("inside $B$ but outside $A$", "在 $B$ 内但在 $A$ 外"),
  t("outside both $A$ and $B$", "在 $A$ 和 $B$ 之外"),
];

/** vennIntro draws 1 to 10 sorted by "even" (A) and "multiple of 3" (B). */
const vennIntro: Figure = {
  svg: venn2Elements([[2, 4, 8, 10], [6], [3, 9], [1, 5, 7]]),
  alt: t(
    "Venn diagram of U = 1 to 10 with A the even numbers and B the multiples of 3: 2, 4, 8, 10 in A only; 6 in both; 3, 9 in B only; 1, 5, 7 outside both.",
    "U = 1 到 10 的韦恩图，A 为偶数，B 为 3 的倍数：仅在 A 中 2、4、8、10；两者都在 6；仅在 B 中 3、9；两者之外 1、5、7。",
  ),
};

/** vennDiagramsInProbability is outline topic 6.16.9. */
export const vennDiagramsInProbability: TopicDef = {
  id: "venn-diagrams-in-probability",
  title: t("Venn Diagrams in Probability", "概率中的韦恩图"),
  summary: t(
    "Place outcomes in the regions of a Venn diagram, read counts from it, and find probabilities of single events.",
    "把结果放入韦恩图的各区域，从图中读出个数，并求单个事件的概率。",
  ),
  prerequisites: ["the-complement-of-an-event"],
  encompasses: [
    { topic: "the-complement-of-an-event", weight: 0.2 },
    { topic: "single-events-in-probability", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.A.1"],
  intro: t(
    `An event splits the sample space in two: the event and its complement. With **two** events, each outcome answers two questions, "in $A$?" and "in $B$?", so the sample space splits into four parts. A **Venn diagram** draws those four parts at once.

Take $U = \\{1, 2, \\ldots, 10\\}$, with $A$ the even numbers and $B$ the multiples of $3$. Draw $U$ as a rectangle and $A$ and $B$ as overlapping circles, and put each number where it belongs:

{{figure 0}}

$6$ is both even and a multiple of $3$, so it goes in the overlap; $3$ and $9$ are in $B$ only; $2, 4, 8, 10$ in $A$ only; and $1, 5, 7$ are in neither, outside both circles. Each number appears exactly once, so the four regions together hold all $10$. Reading the diagram, $P(A) = \\frac{5}{10}$, since $A$ is the whole circle: $4 + 1 = 5$ numbers. In this lesson we place outcomes in a Venn diagram, read counts from one, and find probabilities with it.`,
    `一个事件把样本空间分成两部分：事件与它的对立事件。有**两个**事件时，每个结果要回答两个问题：“在 $A$ 中吗？”“在 $B$ 中吗？”，所以样本空间分成四部分。**韦恩图**能一次画出这四部分。

取 $U = \\{1, 2, \\ldots, 10\\}$，$A$ 为偶数，$B$ 为 $3$ 的倍数。把 $U$ 画成矩形，$A$ 和 $B$ 画成两个相交的圆，再把每个数放到它所属的位置：

{{figure 0}}

$6$ 既是偶数又是 $3$ 的倍数，所以放在重叠部分；$3$ 和 $9$ 只在 $B$ 中；$2, 4, 8, 10$ 只在 $A$ 中；$1, 5, 7$ 两者都不在，放在两圆之外。每个数恰好出现一次，所以四个区域合起来正好是全部 $10$ 个数。从图中读出 $P(A) = \\frac{5}{10}$，因为 $A$ 是整个圆：$4 + 1 = 5$ 个数。这节课我们把结果放入韦恩图，从图中读出个数，并用它求概率。`,
  ),
  introFigures: [vennIntro],
  knowledgePoints: [
    {
      id: "placing-elements-in-a-venn-diagram",
      title: t("Placing elements in a Venn diagram", "把元素放入韦恩图"),
      explanation: t(
        `A **Venn diagram** draws the sample space (or universal set) $U$ as a rectangle and events as circles inside it. Two overlapping circles $A$ and $B$ split the rectangle into four regions: inside $A$ only, inside both, inside $B$ only, and outside both. To place an element, ask two questions about it, "is it in $A$?" and "is it in $B$?"; the two answers pick exactly one region.

Let $U = \\{1, 2, \\ldots, 8\\}$, $A = \\{1, 2, 3, 4\\}$ and $B = \\{3, 4, 5, 6\\}$. Then $1, 2$ go in $A$ only; $3, 4$ in both; $5, 6$ in $B$ only; and $7, 8$ outside both circles:

{{figure 0}}

> **Watch out.** An element in both sets goes in the overlap only, not in both circles' outer parts: "$A$ only" means in $A$ **but not** in $B$. And elements of $U$ in neither set still belong in the diagram, outside the circles.`,
        `**韦恩图**用矩形表示样本空间（全集）$U$，用其中的圆表示事件。两个相交的圆 $A$ 和 $B$ 把矩形分成四个区域：仅在 $A$ 内、同时在两者内、仅在 $B$ 内、两者之外。放置一个元素时，问它两个问题：“在 $A$ 中吗？”“在 $B$ 中吗？”，两个答案恰好确定一个区域。

设 $U = \\{1, 2, \\ldots, 8\\}$，$A = \\{1, 2, 3, 4\\}$，$B = \\{3, 4, 5, 6\\}$。那么 $1, 2$ 放在仅属于 $A$ 的区域；$3, 4$ 放在两者都属于的区域；$5, 6$ 放在仅属于 $B$ 的区域；$7, 8$ 放在两圆之外：

{{figure 0}}

> **注意。** 同时属于两个集合的元素只放在重叠部分，不放在两圆各自的外侧部分：“仅在 $A$ 内”表示在 $A$ 中**但不**在 $B$ 中。两个集合都不包含的 $U$ 的元素也属于这个图，放在两圆之外。`,
      ),
      figures: [
        {
          svg: venn2Elements([
            [1, 2],
            [3, 4],
            [5, 6],
            [7, 8],
          ]),
          alt: t(
            "Venn diagram of U = 1 to 8: 1, 2 in A only; 3, 4 in both; 5, 6 in B only; 7, 8 outside both.",
            "U = 1 到 8 的韦恩图：仅在 A 中 1、2；两者都在 3、4；仅在 B 中 5、6；两者之外 7、8。",
          ),
        },
      ],
      generate(rng) {
        const n = rng.int(10, 16);
        const u = range(1, n);
        for (;;) {
          const a = unique(rng.sample(u, rng.int(3, 7)));
          const b = unique(rng.sample(u, rng.int(3, 7)));
          const regions = [
            a.filter((x) => !b.includes(x)),
            a.filter((x) => b.includes(x)),
            b.filter((x) => !a.includes(x)),
            u.filter((x) => !a.includes(x) && !b.includes(x)),
          ];
          if (regions.some((r) => r.length === 0)) continue;
          const r = rng.int(0, 3);
          const [ma, mb] = venn2Members[r]!;
          return {
            ...setProblem({
              prompt: t(
                `Let $U = \\{1, 2, \\ldots, ${n}\\}$, $A = ${setTex(a)}$ and $B = ${setTex(b)}$. Which elements go in the region of the Venn diagram ${regionNames[r]!.en}?${SET_EN}`,
                `设 $U = \\{1, 2, \\ldots, ${n}\\}$，$A = ${setTex(a)}$，$B = ${setTex(b)}$。韦恩图中${regionNames[r]!["zh-CN"]}的区域应放哪些元素？${SET_ZH}`,
              ),
              values: regions[r]!,
              wrong: [...regions.filter((_, i) => i !== r), r === 0 ? a : r === 2 ? b : r === 1 ? unique([...a, ...b]) : u],
              solution: t(
                `${stepLabel(1, "sort every element", "给每个元素分类").en} Ask of each element of $U$: is it in $A$, and is it in $B$?

- $A$ only: $${setTex(regions[0]!)}$
- both: $${setTex(regions[1]!)}$
- $B$ only: $${setTex(regions[2]!)}$
- neither: $${setTex(regions[3]!)}$

${stepLabel(2, "read the region", "读出区域").en} The region ${regionNames[r]!.en}, shaded, holds $${setTex(regions[r]!)}$:

{{figure 0}}

**Check.** The four regions hold $${plus(regions.map((x) => x.length))}$ elements, all $${n}$ of $U$, each once. ${r === 1 ? `Every element of the overlap appears in both lists given.` : r === 3 ? `None of the elements outside appears in either list given.` : `Each of them is in $${ma ? "A" : "B"}$ but not in $${mb ? "B" : "A"}$.`}`,
                `${stepLabel(1, "sort every element", "给每个元素分类")["zh-CN"]}对 $U$ 的每个元素问：它在 $A$ 中吗？在 $B$ 中吗？

- 仅 $A$：$${setTex(regions[0]!)}$
- 两者：$${setTex(regions[1]!)}$
- 仅 $B$：$${setTex(regions[2]!)}$
- 都不：$${setTex(regions[3]!)}$

${stepLabel(2, "read the region", "读出区域")["zh-CN"]}${regionNames[r]!["zh-CN"]}的区域（阴影）是 $${setTex(regions[r]!)}$：

{{figure 0}}

**检验。** 四个区域共有 $${plus(regions.map((x) => x.length))}$ 个元素，正是 $U$ 的全部 $${n}$ 个，每个只出现一次。${r === 1 ? "重叠部分的每个元素在给出的两个集合中都出现。" : r === 3 ? "两圆之外的元素在给出的两个集合中都不出现。" : `它们都在 $${ma ? "A" : "B"}$ 中而不在 $${mb ? "B" : "A"}$ 中。`}`,
              ),
            }),
            figure: {
              svg: venn2Svg(["", "", "", ""]),
              alt: t("Venn diagram: a rectangle U containing two overlapping circles A and B.", "韦恩图：矩形 U 中有两个相交的圆 A 和 B。"),
            },
            solutionFigures: [
              {
                svg: venn2Elements(regions, (x, y) => x === ma && y === mb),
                alt: t(
                  `Venn diagram with the elements placed: ${regions[0]!.join(", ")} in A only; ${regions[1]!.join(", ")} in both; ${regions[2]!.join(", ")} in B only; ${regions[3]!.join(", ")} outside. The region ${regionNames[r]!.en.replace(/\$/g, "")} is shaded.`,
                  `放好元素的韦恩图：仅在 A 中 ${regions[0]!.join("、")}；两者都在 ${regions[1]!.join("、")}；仅在 B 中 ${regions[2]!.join("、")}；两者之外 ${regions[3]!.join("、")}。${regionNames[r]!["zh-CN"].replace(/\$/g, "")}的区域涂上阴影。`,
                ),
              },
            ],
          };
        }
      },
    },
    {
      id: "reading-counts-from-a-venn-diagram",
      title: t("Reading counts from a Venn diagram", "从韦恩图读出个数"),
      explanation: t(
        `A Venn diagram may show **how many** elements lie in each region instead of the elements themselves. A set is then a union of regions, and its count is their sum. The whole circle $A$ is two regions, $A$ only and the overlap, so $n(A)$ adds those two numbers; $n(U)$ adds all four.

With $9$ in $A$ only, $4$ in both, $15$ in $B$ only and $6$ outside: $n(A) = 9 + 4 = 13$, $n(B) = 4 + 15 = 19$, and $n(U) = 9 + 4 + 15 + 6 = 34$. As a check, $n(A') = 15 + 6 = 21$ and $13 + 21 = 34$.

> **Watch out.** The number written in the left part of circle $A$ is only "$A$ only": $n(A)$ also includes the overlap. And $n(U)$ includes the region outside both circles.`,
        `韦恩图也可以不写元素，而写出每个区域中元素的**个数**。这时一个集合由若干区域组成，它的元素个数就是这些区域之和。整个圆 $A$ 由两个区域组成：仅 $A$ 和重叠部分，所以 $n(A)$ 把这两个数相加；$n(U)$ 把四个数相加。

仅 $A$ 有 $9$，两者都有 $4$，仅 $B$ 有 $15$，两者之外有 $6$：$n(A) = 9 + 4 = 13$，$n(B) = 4 + 15 = 19$，$n(U) = 9 + 4 + 15 + 6 = 34$。检验：$n(A') = 15 + 6 = 21$，$13 + 21 = 34$。

> **注意。** 圆 $A$ 左边部分写的数只是“仅 $A$”：$n(A)$ 还要加上重叠部分。$n(U)$ 也要包括两圆之外的区域。`,
      ),
      figure: venn2Figure([9, 4, 15, 6]),
      generate(rng) {
        const c = venn2Counts(rng);
        const asked = rng.pick(["A", "B", "U", "notA"] as const);
        const [value, work] =
          asked === "A"
            ? [c[0] + c[1], `n(A) = ${c[0]} + ${c[1]} = ${c[0] + c[1]}`]
            : asked === "B"
              ? [c[1] + c[2], `n(B) = ${c[1]} + ${c[2]} = ${c[1] + c[2]}`]
              : asked === "U"
                ? [sum(c), `n(U) = ${c.join(" + ")} = ${sum(c)}`]
                : [c[2] + c[3], `n(A') = ${c[2]} + ${c[3]} = ${c[2] + c[3]}`];
        const tex = asked === "notA" ? "A'" : asked;
        const shade: Shading =
          asked === "A"
            ? { en: "the whole circle A", zh: "整个圆 A", test: (a) => a }
            : asked === "B"
              ? { en: "the whole circle B", zh: "整个圆 B", test: (_, b) => b }
              : asked === "U"
                ? { en: "the whole rectangle U", zh: "整个矩形 U", test: () => true }
                : { en: "everything outside circle A", zh: "圆 A 之外的全部", test: (a) => !a };
        const regionsText: Text =
          asked === "A"
            ? t("the whole circle $A$: $A$ only and the overlap", "整个圆 $A$：仅 $A$ 和重叠部分")
            : asked === "B"
              ? t("the whole circle $B$: the overlap and $B$ only", "整个圆 $B$：重叠部分和仅 $B$")
              : asked === "U"
                ? t("the whole rectangle: all four regions", "整个矩形：全部四个区域")
                : t("everything outside circle $A$: $B$ only and outside both", "圆 $A$ 之外的全部：仅 $B$ 和两者之外");
        const check: Text =
          asked === "U"
            ? t(
                `**Check.** Group the regions another way: $n(A) = ${c[0] + c[1]}$ and $n(A') = ${c[2] + c[3]}$, and $${c[0] + c[1]} + ${c[2] + c[3]} = ${sum(c)}$.`,
                `**检验。** 换一种方式分组：$n(A) = ${c[0] + c[1]}$，$n(A') = ${c[2] + c[3]}$，$${c[0] + c[1]} + ${c[2] + c[3]} = ${sum(c)}$。`,
              )
            : t(
                `**Check.** The unshaded regions hold $${sum(c) - value}$, and $${value} + ${sum(c) - value} = ${sum(c)} = n(U)$: together the shaded and unshaded parts are the whole of $U$.`,
                `**检验。** 没有阴影的区域有 $${sum(c) - value}$，$${value} + ${sum(c) - value} = ${sum(c)} = n(U)$：阴影与非阴影部分合起来正好是整个 $U$。`,
              );
        return {
          ...numberProblem({
            prompt: t(
              `The Venn diagram shows the number of elements in each region. Find $n(${tex})$.`,
              `韦恩图标出了每个区域的元素个数。求 $n(${tex})$。`,
            ),
            answer: value,
            form: "integer",
            wrong: [c[0], c[2], c[0] + c[2], sum(c) - c[3], c[3]],
            solution: t(
              `${stepLabel(1, "shade the set", "画出集合").en} $${tex}$ is ${regionsText.en}:

{{figure 0}}

${stepLabel(2, "add its regions", "把它的区域相加").en}${steps(work)}${check.en}`,
              `${stepLabel(1, "shade the set", "画出集合")["zh-CN"]}$${tex}$ 是${regionsText["zh-CN"]}：

{{figure 0}}

${stepLabel(2, "add its regions", "把它的区域相加")["zh-CN"]}${steps(work)}${check["zh-CN"]}`,
            ),
          }),
          figure: venn2Figure(c),
          solutionFigures: [venn2Figure(c, shade)],
        };
      },
    },
    {
      id: "probabilities-from-a-venn-diagram",
      figure: geometryDrawings2["venn-diagrams-in-probability#probabilities-from-a-venn-diagram"],
      title: t("Probabilities from a Venn diagram", "由韦恩图求概率"),
      explanation: t(
        `When one member of $U$ is chosen at random, each member is equally likely, so the probability of an event is its count over the count of everything:

$$P(A) = \\frac{n(A)}{n(U)}$$

Shade the event on the diagram, add the shaded regions for the top, and add **all** the regions for the bottom. In the diagram below, $P(A) = \\frac{17}{42}$ and $P(B) = \\frac{23}{42}$, and $P(A') = \\frac{25}{42}$, which adds to $P(A)$ to make $1$.

> **Watch out.** The bottom is $n(U)$, the total of all four regions, including the region outside both circles; leaving it out makes every probability too large. And the top for $A$ is the whole circle, overlap included, not just "$A$ only".`,
        `从 $U$ 中随机选一个成员时，每个成员被选中的可能性相同，所以事件的概率是它的个数除以全部的个数：

$$P(A) = \\frac{n(A)}{n(U)}$$

在图上把事件涂上阴影，分子是阴影区域之和，分母是**所有**区域之和。在下图中，$P(A) = \\frac{17}{42}$，$P(B) = \\frac{23}{42}$，$P(A') = \\frac{25}{42}$，它与 $P(A)$ 之和为 $1$。

> **注意。** 分母是 $n(U)$，即四个区域之和，包括两圆之外的区域；漏掉它会让每个概率都偏大。$A$ 的分子是整个圆，包括重叠部分，而不只是“仅 $A$”。`,
      ),
      generate(rng) {
        const s = rng.pick(surveys);
        const c = venn2Counts(rng);
        const total = sum(c);
        const events: VennEvent[] = [
          { tex: "A", en: "the whole circle $A$", zh: "整个圆 $A$", test: (a) => a },
          { tex: "B", en: "the whole circle $B$", zh: "整个圆 $B$", test: (_, b) => b },
          { tex: "A'", en: "everything outside circle $A$", zh: "圆 $A$ 之外的全部区域", test: (a) => !a },
          { tex: "B'", en: "everything outside circle $B$", zh: "圆 $B$ 之外的全部区域", test: (_, b) => !b },
        ];
        const e = rng.pick(events);
        const n = vennCount(c, e.test);
        return {
          ...probProblem(
            t(`${surveyPrompt(s, total).en} Find $P(${e.tex})$.`, `${surveyPrompt(s, total)["zh-CN"]}求 $P(${e.tex})$。`),
            Q.of(n, total),
            vennSolution(c, e),
            [Q.of(c[0], total), Q.of(c[2], total), Q.of(n, total - c[3]), Q.of(total - n, total)],
          ),
          figure: venn2Figure(c),
          solutionFigures: [venn2Figure(c, e)],
        };
      },
    },
  ],
};

/** segmentMarks draws a segment of the number line from lo to hi with the parts between the given cuts, those in shaded, accented, and the length of every part written above it. */
function segmentMarks(cuts: readonly number[], shaded: (i: number) => boolean, lengths = true): Mark[] {
  const marks: Mark[] = [];
  cuts.slice(1).forEach((b, i) => {
    const a = cuts[i]!;
    marks.push({ kind: "segment", a: [a, 0], b: [b, 0], ...(shaded(i) ? { accent: true } : {}) });
    if (lengths) marks.push({ kind: "label", at: [(a + b) / 2, 0.15], text: String(b - a), dir: "n" });
  });
  for (const x of cuts) {
    marks.push({ kind: "dot", at: [x, 0] });
    marks.push({ kind: "label", at: [x, 0], text: String(x), dir: "s" });
  }
  return marks;
}

/** geometricIntro draws a 60 cm ribbon with the 10 cm at each end shaded. */
const geometricIntro: Figure = {
  svg: sketch(segmentMarks([0, 10, 50, 60], (i) => i !== 1)),
  alt: t(
    "A ribbon from 0 to 60 cm, with the parts from 0 to 10 and from 50 to 60 highlighted: 20 cm of the 60.",
    "从 0 到 60 cm 的丝带，0 到 10 与 50 到 60 两段突出显示：60 cm 中的 20 cm。",
  ),
};

/** geometricProbability is outline topic 6.16.10. */
export const geometricProbability: TopicDef = {
  id: "geometric-probability",
  title: t("Geometric Probability", "几何概率"),
  summary: t(
    "Find probabilities as ratios of lengths or areas when a point is chosen at random on a segment or in a region.",
    "在线段上或区域内随机取点时，用长度或面积之比求概率。",
  ),
  prerequisites: ["single-events-in-probability", "areas-of-circles"],
  encompasses: [
    { topic: "single-events-in-probability", weight: 0.2 },
    { topic: "areas-of-circles", weight: 0.3 },
    { topic: "area-of-rectangles-and-squares", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSG.MG.A.3"],
  intro: t(
    `So far the outcomes could be counted: faces of a die, marbles, cards. But a point chosen anywhere on a line or in a region has infinitely many possible positions, and counting them is hopeless. The idea of a **share** still works: replace "number of outcomes" by **length** or **area**.

A ribbon $60$ cm long is cut at a random point. What is the probability that the cut lands within $10$ cm of an end? The cut is equally likely to land anywhere, so each centimeter carries the same chance. The cuts that count fill the two highlighted parts:

{{figure 0}}

Together they are $10 + 10 = 20$ cm of the $60$, so

$$P = \\frac{20}{60} = \\frac{1}{3}.$$

The middle part, $40$ cm, gives the complement, $\\frac{40}{60} = \\frac{2}{3}$, and the two add to $1$ as they should. In this lesson we find probabilities as ratios of lengths on a segment and of areas in rectangles and circles.`,
    `到目前为止，结果都能数清：骰子的面、球、卡片。但在一条线段上或一个区域内任取一点，它的位置有无穷多种，没法一个个数。不过“比例”的想法仍然适用：把“结果的个数”换成**长度**或**面积**。

一条 $60$ cm 长的丝带在随机的位置剪断。剪口离某一端不超过 $10$ cm 的概率是多少？剪口落在任何位置的可能性相同，所以每一厘米的机会都一样。符合要求的剪口落在两段突出显示的部分上：

{{figure 0}}

它们合起来是 $60$ cm 中的 $10 + 10 = 20$ cm，所以

$$P = \\frac{20}{60} = \\frac{1}{3}.$$

中间的 $40$ cm 对应对立事件，$\\frac{40}{60} = \\frac{2}{3}$，两者之和为 $1$，正应如此。这节课我们用线段上的长度之比、矩形和圆中的面积之比来求概率。`,
  ),
  introFigures: [geometricIntro],
  knowledgePoints: [
    {
      id: "probability-on-a-segment",
      figure: geometryDrawings2["geometric-probability#probability-on-a-segment"],
      title: t("Probability on a segment", "线段上的概率"),
      explanation: t(
        `When a point is chosen at random on a segment, every part of the same length is equally likely to contain it: two parts of $1$ unit each have the same chance. So the chance of a part grows in proportion to its length, and

$$P = \\frac{\\text{length of the part}}{\\text{length of the whole segment}}$$

A point is chosen on the number line between $0$ and $20$. The probability that it lies between $6$ and $11$ is $\\frac{11 - 6}{20} = \\frac{5}{20} = \\frac{1}{4}$: the part is $5$ units long, a quarter of the whole.

> **Watch out.** Use lengths, found by subtracting the ends, not the end numbers themselves: $\\frac{5}{20}$, not $\\frac{6}{11}$ or $\\frac{11}{20}$. When the segment does not start at $0$, its length is also a difference, such as $30 - 10 = 20$.`,
        `在线段上随机取一点时，长度相同的各部分包含该点的可能性相同：两段各长 $1$ 个单位，机会就一样。所以一部分的机会与它的长度成正比：

$$P = \\frac{\\text{这部分的长度}}{\\text{整条线段的长度}}$$

在数轴上 $0$ 到 $20$ 之间随机取一点。它落在 $6$ 和 $11$ 之间的概率是 $\\frac{11 - 6}{20} = \\frac{5}{20} = \\frac{1}{4}$：这部分长 $5$ 个单位，是整体的四分之一。

> **注意。** 要用长度，即两端相减，而不是端点的数本身：是 $\\frac{5}{20}$，不是 $\\frac{6}{11}$ 或 $\\frac{11}{20}$。线段不从 $0$ 开始时，它的长度也是一个差，例如 $30 - 10 = 20$。`,
      ),
      generate(rng) {
        const lo = rng.pick([0, 0, 0, 2, 4, 5, 10]);
        const len = rng.pick([8, 10, 12, 15, 16, 20, 24, 25, 30, 40]);
        const hi = lo + len;
        const c = rng.int(lo + 1, hi - 2);
        const d = rng.int(c + 1, hi - 1);
        const marks: Mark[] = [
          { kind: "segment", a: [lo, 0], b: [hi, 0] },
          { kind: "segment", a: [c, 0], b: [d, 0], accent: true },
          ...[lo, c, d, hi].flatMap((x): Mark[] => [
            { kind: "dot", at: [x, 0] },
            { kind: "label", at: [x, 0], text: String(x), dir: "s" },
          ]),
        ];
        const rest = len - (d - c);
        return {
          ...probProblem(
            t(
              `A point is chosen at random on the number line between $${lo}$ and $${hi}$. What is the probability that it lies between $${c}$ and $${d}$?`,
              `在数轴上 $${lo}$ 与 $${hi}$ 之间随机取一点。它落在 $${c}$ 与 $${d}$ 之间的概率是多少？`,
            ),
            Q.of(d - c, len),
            t(
              `${stepLabel(1, "the two lengths", "两个长度").en} The part from $${c}$ to $${d}$ has length $${d} - ${c} = ${d - c}$, and the whole segment from $${lo}$ to $${hi}$ has length $${hi} - ${lo} = ${len}$. The lengths of all the pieces are written above them:

{{figure 0}}

${stepLabel(2, "divide", "相除").en} Every unit of length is equally likely to hold the point:${steps(`P = ${ratio(d - c, len)}`)}**Check.** The point misses the part when it lands on the other pieces, of total length $${c - lo} + ${hi - d} = ${rest}$. And $\\frac{${d - c}}{${len}} + \\frac{${rest}}{${len}} = 1$.`,
              `${stepLabel(1, "the two lengths", "两个长度")["zh-CN"]}从 $${c}$ 到 $${d}$ 的部分长 $${d} - ${c} = ${d - c}$，从 $${lo}$ 到 $${hi}$ 的整条线段长 $${hi} - ${lo} = ${len}$。各段的长度写在它们上方：

{{figure 0}}

${stepLabel(2, "divide", "相除")["zh-CN"]}每一单位长度包含该点的可能性相同：${steps(`P = ${ratio(d - c, len)}`)}**检验。** 点落在其他段上时就落不到这部分，其他段总长 $${c - lo} + ${hi - d} = ${rest}$。并且 $\\frac{${d - c}}{${len}} + \\frac{${rest}}{${len}} = 1$。`,
            ),
            [Q.of(d - c, d), Q.of(d - c + 1, len + 1), Q.of(len - (d - c), len), ...(lo > 0 ? [Q.of(d - c, hi)] : [])],
          ),
          figure: {
            svg: sketch(marks),
            alt: t(
              `A segment of the number line from ${lo} to ${hi}, with the part from ${c} to ${d} highlighted.`,
              `数轴上从 ${lo} 到 ${hi} 的线段，其中 ${c} 到 ${d} 的部分被突出显示。`,
            ),
          },
          solutionFigures: [
            {
              svg: sketch(segmentMarks([lo, c, d, hi], (i) => i === 1)),
              alt: t(
                `The segment from ${lo} to ${hi} cut at ${c} and ${d} into pieces of lengths ${c - lo}, ${d - c} and ${hi - d}, the middle one highlighted.`,
                `从 ${lo} 到 ${hi} 的线段在 ${c} 和 ${d} 处分成长 ${c - lo}、${d - c}、${hi - d} 的三段，中间一段突出显示。`,
              ),
            },
          ],
        };
      },
    },
    {
      id: "probability-with-areas",
      figure: probabilityDrawings["probability-with-areas"],
      title: t("Probability with areas", "面积中的概率"),
      explanation: t(
        `In a region, area plays the part that length played on a segment. When a point is chosen at random in a region, such as a dart landing anywhere on a board, any two pieces of the same area are equally likely to hold it, so

$$P = \\frac{\\text{area of the part}}{\\text{area of the whole region}}$$

A board is a $10 \\times 8$ rectangle with a $4 \\times 3$ rectangle inside it. The board has area $80$ and the small rectangle $12$, so a dart landing on the board hits the small rectangle with probability $\\frac{12}{80} = \\frac{3}{20}$, and misses it with probability $\\frac{80 - 12}{80} = \\frac{17}{20}$.

> **Watch out.** Compare **areas**, not side lengths or perimeters: $\\frac{4 + 3}{10 + 8}$ is not the probability. For "outside", the part is the board minus the small rectangle, $80 - 12$, not the small rectangle compared with the rest.`,
        `在区域中，面积起着线段上长度的作用。在区域内随机取一点时（例如飞镖随机落在靶板上），面积相同的任意两块包含该点的可能性相同，所以

$$P = \\frac{\\text{这部分的面积}}{\\text{整个区域的面积}}$$

靶板是 $10 \\times 8$ 的矩形，内有一个 $4 \\times 3$ 的矩形。靶板面积 $80$，小矩形面积 $12$，所以落在靶板上的飞镖击中小矩形的概率是 $\\frac{12}{80} = \\frac{3}{20}$，击不中的概率是 $\\frac{80 - 12}{80} = \\frac{17}{20}$。

> **注意。** 比较的是**面积**，不是边长或周长：$\\frac{4 + 3}{10 + 8}$ 不是概率。求“落在外面”时，这部分是靶板减去小矩形，即 $80 - 12$，而不是小矩形与其余部分之比。`,
      ),
      generate(rng) {
        const W = rng.int(8, 20);
        const H = rng.int(6, Math.min(14, W));
        const w = rng.int(2, W - 4);
        const h = rng.int(2, H - 4);
        const inside = rng.bool(0.7);
        const [x0, y0] = [(W - w) / 2, (H - h) / 2];
        const inner: Point[] = [
          [x0, y0],
          [x0 + w, y0],
          [x0 + w, y0 + h],
          [x0, y0 + h],
        ];
        const outer: Point[] = [
          [0, 0],
          [W, 0],
          [W, H],
          [0, H],
        ];
        const u = rng.pick(["cm", "in"]);
        const marks: Mark[] = [
          { kind: "polygon", points: outer },
          { kind: "polygon", points: inner, accent: true },
          { kind: "side", a: outer[0]!, b: outer[1]!, text: `${W} ${u}` },
          { kind: "side", a: outer[3]!, b: outer[0]!, text: `${H} ${u}` },
          { kind: "side", a: inner[0]!, b: inner[1]!, text: `${w} ${u}` },
          { kind: "side", a: inner[1]!, b: inner[2]!, text: `${h} ${u}` },
        ];
        const big = W * H;
        const small = w * h;
        const k = inside ? small : big - small;
        return {
          ...probProblem(
            inside
              ? t(
                  `A dart lands at a random point on the ${W} ${u} by ${H} ${u} board shown. What is the probability that it lands inside the highlighted ${w} ${u} by ${h} ${u} rectangle?`,
                  `飞镖随机落在图中 ${W} ${u} × ${H} ${u} 的靶板上。它落在突出显示的 ${w} ${u} × ${h} ${u} 矩形内的概率是多少？`,
                )
              : t(
                  `A dart lands at a random point on the ${W} ${u} by ${H} ${u} board shown. What is the probability that it lands outside the highlighted ${w} ${u} by ${h} ${u} rectangle?`,
                  `飞镖随机落在图中 ${W} ${u} × ${H} ${u} 的靶板上。它落在突出显示的 ${w} ${u} × ${h} ${u} 矩形外的概率是多少？`,
                ),
            Q.of(k, big),
            t(
              `${stepLabel(1, "the two areas", "两个面积").en} The board has area $${W} \\times ${H} = ${big}$ and the small rectangle $${w} \\times ${h} = ${small}$ square ${u === "cm" ? "centimeters" : "inches"}.${inside ? "" : ` The part outside the small rectangle has area $${big} - ${small} = ${k}$.`} The region that counts is shaded:

{{figure 0}}

${stepLabel(2, "divide", "相除").en} Every piece of equal area is equally likely to hold the dart:${steps(`P = ${ratio(k, big)}`)}**Check.** The ${inside ? "rest of the board" : "small rectangle"} has area $${big - k}$, and $${k} + ${big - k} = ${big}$, the whole board, so the two probabilities add to $1$. The answer lies between $0$ and $1$.`,
              `${stepLabel(1, "the two areas", "两个面积")["zh-CN"]}靶板面积 $${W} \\times ${H} = ${big}$，小矩形面积 $${w} \\times ${h} = ${small}$（平方${u === "cm" ? "厘米" : "英寸"}）。${inside ? "" : `小矩形外的面积是 $${big} - ${small} = ${k}$。`}符合要求的区域涂上阴影：

{{figure 0}}

${stepLabel(2, "divide", "相除")["zh-CN"]}面积相同的每一块包含飞镖落点的可能性相同：${steps(`P = ${ratio(k, big)}`)}**检验。** ${inside ? "靶板的其余部分" : "小矩形"}面积为 $${big - k}$，$${k} + ${big - k} = ${big}$，正是整个靶板，所以两个概率之和为 $1$。答案在 $0$ 与 $1$ 之间。`,
            ),
            [Q.of(big - k, big), Q.of(w + h, W + H), Q.of(small, big - small), Q.of(w * h, 2 * (W + H))],
          ),
          figure: {
            svg: sketch(marks),
            alt: t(
              `A ${W} by ${H} rectangle with a highlighted ${w} by ${h} rectangle in its center.`,
              `一个 ${W} × ${H} 的矩形，中央有一个突出显示的 ${w} × ${h} 矩形。`,
            ),
          },
          solutionFigures: [
            {
              svg: sketch([inside ? { kind: "shade", points: inner } : { kind: "shade", points: outer, holes: [inner] }, ...marks]),
              alt: t(
                `The ${W} by ${H} board with ${inside ? "the small rectangle" : "everything outside the small rectangle"} shaded.`,
                `${W} × ${H} 的靶板，${inside ? "小矩形" : "小矩形之外的部分"}涂上阴影。`,
              ),
            },
          ],
        };
      },
    },
    {
      id: "probability-with-circles",
      figure: probabilityDrawings["probability-with-circles"],
      title: t("Probability with circles", "圆中的概率"),
      explanation: t(
        `The same ratio of areas works with circles. A circle of radius $r$ has area $\\pi r^2$, so the answer contains $\\pi$; leave it there for the exact value.

A circle of radius $3$ is drawn inside a $10 \\times 8$ rectangle. A point chosen at random in the rectangle lands in the circle with probability

$$\\frac{\\pi \\cdot 3^2}{10 \\times 8} = \\frac{9\\pi}{80}$$

and outside it with probability $1 - \\frac{9\\pi}{80}$. As an estimate, $9 \\times 3.14 = 28.26$, so $\\frac{9\\pi}{80} \\approx 0.35$: a bit over a third of the rectangle.

> **Watch out.** The area uses the radius **squared**: $\\pi \\cdot 3^2 = 9\\pi$, not $3\\pi$ or $6\\pi$ (that is half the circumference). And use the area of the rectangle, $10 \\times 8$, not its perimeter.`,
        `面积之比同样适用于圆。半径为 $r$ 的圆面积是 $\\pi r^2$，所以答案含 $\\pi$；求精确值时保留 $\\pi$。

在 $10 \\times 8$ 的矩形内画一个半径为 $3$ 的圆。在矩形内随机取一点，它落在圆内的概率是

$$\\frac{\\pi \\cdot 3^2}{10 \\times 8} = \\frac{9\\pi}{80}$$

落在圆外的概率是 $1 - \\frac{9\\pi}{80}$。估算一下，$9 \\times 3.14 = 28.26$，所以 $\\frac{9\\pi}{80} \\approx 0.35$：比矩形的三分之一多一点。

> **注意。** 面积用的是半径的**平方**：$\\pi \\cdot 3^2 = 9\\pi$，不是 $3\\pi$，也不是 $6\\pi$（那是周长的一半）。矩形要用面积 $10 \\times 8$，而不是周长。`,
      ),
      generate(rng) {
        const r = rng.int(1, 6);
        const W = rng.int(2 * r, 2 * r + 8);
        const H = rng.int(2 * r, Math.max(2 * r, W));
        const inside = rng.bool(0.6);
        const p = Q.of(r * r, W * H);
        const answer = inside ? piTex(p) : `1 - ${piTex(p)}`;
        const c: Point = [W / 2, H / 2];
        const outer: Point[] = [
          [0, 0],
          [W, 0],
          [W, H],
          [0, H],
        ];
        const marks: Mark[] = [
          { kind: "polygon", points: outer },
          { ...ring(c, r), accent: true },
          { kind: "dot", at: c },
          { kind: "segment", a: c, b: [c[0] + r * 0.6, c[1] + r * 0.8] },
          { kind: "label", at: [c[0] + r * 0.3, c[1] + r * 0.4], text: String(r), dir: "w" },
          { kind: "side", a: outer[0]!, b: outer[1]!, text: String(W) },
          { kind: "side", a: outer[3]!, b: outer[0]!, text: String(H) },
        ];
        const wrongP = [Q.of(r, W * H), Q.of(2 * r, W * H), Q.of(r * r, 2 * (W + H))];
        const approx = (r * r * 3.14) / (W * H);
        const shown = (inside ? approx : 1 - approx).toFixed(2);
        const disc = ringPoints(c, r);
        return {
          ...expressionProblem({
            prompt: inside
              ? t(
                  `A circle of radius ${r} lies inside a ${W} by ${H} rectangle, as shown. A point is chosen at random inside the rectangle. What is the probability that it lies inside the circle? Give the exact answer in terms of $\\pi$.`,
                  `如图，半径为 ${r} 的圆位于 ${W} × ${H} 的矩形内。在矩形内随机取一点，它落在圆内的概率是多少？结果保留 $\\pi$。`,
                )
              : t(
                  `A circle of radius ${r} lies inside a ${W} by ${H} rectangle, as shown. A point is chosen at random inside the rectangle. What is the probability that it lies outside the circle? Give the exact answer in terms of $\\pi$.`,
                  `如图，半径为 ${r} 的圆位于 ${W} × ${H} 的矩形内。在矩形内随机取一点，它落在圆外的概率是多少？结果保留 $\\pi$。`,
                ),
            answer,
            simplified: true,
            wrong: [
              ...wrongP.map((w) => (inside ? piTex(w) : `1 - ${piTex(w)}`)),
              inside ? `1 - ${piTex(p)}` : piTex(p),
              poly([Q.of(W * H), ""], [Q.of(-r * r), "\\pi"]),
            ],
            solution: t(
              `${stepLabel(1, "the two areas", "两个面积").en} The circle has area $\\pi \\cdot ${r}^2 = ${piTex(Q.of(r * r))}$ and the rectangle $${W} \\times ${H} = ${W * H}$. The region that counts is shaded:

{{figure 0}}

${stepLabel(2, "divide", "相除").en}${steps(`P(\\text{inside}) = \\frac{${piTex(Q.of(r * r))}}{${W * H}} = ${piTex(p)}`)}${inside ? "" : `The outside is the complement of the inside:${steps(`P(\\text{outside}) = 1 - ${piTex(p)}`)}`}**Check.** With $\\pi \\approx 3.14$, the answer is about $${shown}$, which lies between $0$ and $1$: the circle fits inside the rectangle, since its width $${2 * r}$ is no more than $${H}$ or $${W}$, so it can take up only part of it.`,
              `${stepLabel(1, "the two areas", "两个面积")["zh-CN"]}圆的面积是 $\\pi \\cdot ${r}^2 = ${piTex(Q.of(r * r))}$，矩形面积是 $${W} \\times ${H} = ${W * H}$。符合要求的区域涂上阴影：

{{figure 0}}

${stepLabel(2, "divide", "相除")["zh-CN"]}${steps(`P(\\text{圆内}) = \\frac{${piTex(Q.of(r * r))}}{${W * H}} = ${piTex(p)}`)}${inside ? "" : `圆外是圆内的对立事件：${steps(`P(\\text{圆外}) = 1 - ${piTex(p)}`)}`}**检验。** 取 $\\pi \\approx 3.14$，答案约为 $${shown}$，在 $0$ 与 $1$ 之间：圆放得进矩形，因为它的直径 $${2 * r}$ 不超过 $${H}$ 和 $${W}$，所以只占矩形的一部分。`,
            ),
          }),
          figure: {
            svg: sketch(marks),
            alt: t(
              `A ${W} by ${H} rectangle with a highlighted circle of radius ${r} at its center.`,
              `一个 ${W} × ${H} 的矩形，中央有一个突出显示的半径为 ${r} 的圆。`,
            ),
          },
          solutionFigures: [
            {
              svg: sketch([inside ? { kind: "shade", points: disc } : { kind: "shade", points: outer, holes: [disc] }, ...marks]),
              alt: t(
                `The ${W} by ${H} rectangle with ${inside ? "the circle" : "everything outside the circle"} shaded.`,
                `${W} × ${H} 的矩形，${inside ? "圆" : "圆之外的部分"}涂上阴影。`,
              ),
            },
          ],
        };
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// 6.17 Compound Events in Probability
// ---------------------------------------------------------------------------

/** twoSets draws two listed sets of numbers from 1 to 20 that overlap in at least one element. */
function twoSets(rng: Rng, disjointChance = 0): [number[], number[]] {
  for (;;) {
    const a = unique(rng.sample(range(1, 20), rng.int(3, 7)));
    const b = unique(rng.sample(range(1, 20), rng.int(3, 7)));
    const common = a.filter((x) => b.includes(x)).length;
    const wantDisjoint = rng.bool(disjointChance);
    if (wantDisjoint ? common === 0 : common > 0 && common < Math.min(a.length, b.length)) return [a, b];
  }
}

const union = (a: readonly number[], b: readonly number[]) => unique([...a, ...b]);
const intersection = (a: readonly number[], b: readonly number[]) => a.filter((x) => b.includes(x));
const difference = (a: readonly number[], b: readonly number[]) => a.filter((x) => !b.includes(x));

/** listedVenn draws two listed sets in a Venn diagram, elements written in their regions, with the regions passing shade shaded. */
const listedVenn = (
  a: readonly number[],
  b: readonly number[],
  shade: (x: boolean, y: boolean) => boolean,
  en: string,
  zh: string,
): Figure => {
  const regions = regionsOf(union(a, b), a, b);
  return {
    svg: venn2Elements(regions, shade),
    alt: t(
      `Venn diagram of A and B: ${regions[0]!.join(", ") || "nothing"} in A only; ${regions[1]!.join(", ") || "nothing"} in both; ${regions[2]!.join(", ") || "nothing"} in B only. Shaded: ${en}.`,
      `A 与 B 的韦恩图：仅在 A 中 ${regions[0]!.join("、") || "无"}；两者都在 ${regions[1]!.join("、") || "无"}；仅在 B 中 ${regions[2]!.join("、") || "无"}。阴影部分：${zh}。`,
    ),
  };
};

/** rowsFigure draws U in rows of numbered boxes, one row for each named set, with its elements shaded. */
const rowsFigure = (u: readonly number[], rows: readonly (readonly [string, readonly number[]])[], en: string, zh: string): Figure => ({
  svg: strips(
    u,
    rows.map(([name, xs]) => ({ name, has: (x: number) => xs.includes(x) })),
  ),
  alt: t(en, zh),
});

/** unionIntro draws the factors of 6 and of 8 in a Venn diagram with the union shaded. */
const unionIntro: Figure = listedVenn([1, 2, 3, 6], [1, 2, 4, 8], (a, b) => a || b, "both circles", "两个圆");

/** theUnionOfSets is outline topic 6.17.1. */
export const theUnionOfSets: TopicDef = {
  id: "the-union-of-sets",
  title: t("The Union of Sets", "集合的并集"),
  summary: t(
    "Find the union of two sets, and the number of its elements from a Venn diagram.",
    "求两个集合的并集，并由韦恩图求其元素个数。",
  ),
  prerequisites: ["venn-diagrams-in-probability"],
  encompasses: [{ topic: "sets", weight: 0.3 }],
  xp: 10,
  standards: ["CCSS.HSS.CP.A.1"],
  intro: t(
    `A Venn diagram sorts the elements of two sets into regions. Often we want to put regions back together: everything that is in one set **or** the other. Events built with "or" ask exactly this, such as "the card is red or a king".

Let $A = \\{1, 2, 3, 6\\}$, the factors of $6$, and $B = \\{1, 2, 4, 8\\}$, the factors of $8$. The numbers in at least one of them fill both circles:

{{figure 0}}

Reading the shaded regions gives $\\{1, 2, 3, 4, 6, 8\\}$, the **union** of $A$ and $B$, written $A \\cup B$. Notice that $1$ and $2$ are in both sets but appear once: the union lists each element once. That is why $n(A \\cup B) = 6$, while $n(A) + n(B) = 4 + 4 = 8$ counts the two shared elements twice. In this lesson we list unions of listed and described sets, and count unions from a Venn diagram.`,
    `韦恩图把两个集合的元素分到各个区域。我们常常需要把区域重新合起来：属于这个集合**或**那个集合的全部元素。带“或”的事件问的正是这个，例如“这张牌是红色或是 K”。

设 $A = \\{1, 2, 3, 6\\}$ 是 $6$ 的因数，$B = \\{1, 2, 4, 8\\}$ 是 $8$ 的因数。至少属于其中一个的数填满了两个圆：

{{figure 0}}

读出阴影区域得到 $\\{1, 2, 3, 4, 6, 8\\}$，这是 $A$ 与 $B$ 的**并集**，记作 $A \\cup B$。注意 $1$ 和 $2$ 在两个集合中都有，却只出现一次：并集中每个元素只写一次。所以 $n(A \\cup B) = 6$，而 $n(A) + n(B) = 4 + 4 = 8$ 把两个公共元素数了两次。这节课我们求列举法和描述法给出的集合的并集，并由韦恩图计算并集的元素个数。`,
  ),
  introFigures: [unionIntro],
  knowledgePoints: [
    {
      id: "listing-a-union",
      figure: geometryDrawings2["the-union-of-sets#listing-a-union"],
      title: t("Listing a union", "列举并集"),
      explanation: t(
        `The **union** $A \\cup B$ is the set of elements in $A$ **or** in $B$ (or in both). In a Venn diagram it is everything inside at least one of the circles. To list it, write every element of $A$, then add the elements of $B$ not yet listed, so that an element in both is written once.

$$\\{1, 3, 5, 7\\} \\cup \\{3, 4, 5, 6\\} = \\{1, 3, 4, 5, 6, 7\\}.$$

Here $3$ and $5$ are in both sets. As a check, $n(A \\cup B) = n(A) + n(B) - n(A \\cap B) = 4 + 4 - 2 = 6$.

> **Watch out.** The union takes the elements in **either** set, not only those in both: $\\{3, 5\\}$ is the intersection. And it keeps the shared elements too; leaving out $3$ and $5$ gives only the elements in exactly one set.`,
        `**并集** $A \\cup B$ 是属于 $A$ **或**属于 $B$（或两者都属于）的元素组成的集合。在韦恩图中，它是至少在一个圆内的全部区域。列出并集时，先写出 $A$ 的所有元素，再添上 $B$ 中还没写的元素，这样同时属于两者的元素只写一次。

$$\\{1, 3, 5, 7\\} \\cup \\{3, 4, 5, 6\\} = \\{1, 3, 4, 5, 6, 7\\}.$$

这里 $3$ 和 $5$ 在两个集合中都有。检验：$n(A \\cup B) = n(A) + n(B) - n(A \\cap B) = 4 + 4 - 2 = 6$。

> **注意。** 并集取属于**任一**集合的元素，而不只是两者共有的：$\\{3, 5\\}$ 是交集。公共元素也要保留；去掉 $3$ 和 $5$ 只剩下恰好属于一个集合的元素。`,
      ),
      generate(rng) {
        const [a, b] = twoSets(rng);
        const u = union(a, b);
        const i = intersection(a, b);
        const added = difference(b, a);
        return {
          ...setProblem({
            prompt: t(
              `Let $A = ${setTex(a)}$ and $B = ${setTex(b)}$. Find $A \\cup B$.${SET_EN}`,
              `设 $A = ${setTex(a)}$，$B = ${setTex(b)}$。求 $A \\cup B$。${SET_ZH}`,
            ),
            values: u,
            wrong: [intersection(a, b), union(difference(a, b), difference(b, a)), a, b],
            solution: t(
              `${stepLabel(1, "place the elements", "放置元素").en} $${i.join(", ")}$ ${i.length === 1 ? "is" : "are"} in both sets and go${i.length === 1 ? "es" : ""} in the overlap. The union is everything inside the circles, shaded:

{{figure 0}}

${stepLabel(2, "list the union", "列出并集").en} Take all of $A$, then add the elements of $B$ not yet listed, $${added.join(", ")}$:${steps(`A \\cup B = ${setTex(u)}`)}**Check.** Count by the formula: $n(A) + n(B) - n(A \\cap B) = ${a.length} + ${b.length} - ${i.length} = ${u.length}$, and the list has $${u.length}$ elements.`,
              `${stepLabel(1, "place the elements", "放置元素")["zh-CN"]}$${i.join(", ")}$ 在两个集合中都有，放在重叠部分。并集是两圆内的全部区域（阴影）：

{{figure 0}}

${stepLabel(2, "list the union", "列出并集")["zh-CN"]}取 $A$ 的全部元素，再添上 $B$ 中尚未列出的 $${added.join(", ")}$：${steps(`A \\cup B = ${setTex(u)}`)}**检验。** 用公式计数：$n(A) + n(B) - n(A \\cap B) = ${a.length} + ${b.length} - ${i.length} = ${u.length}$，列表中正好有 $${u.length}$ 个元素。`,
            ),
          }),
          solutionFigures: [listedVenn(a, b, (x, y) => x || y, "both circles, the union", "两个圆，即并集")],
        };
      },
    },
    {
      id: "unions-of-described-sets",
      title: t("Unions of described sets", "由描述给出的集合的并集"),
      explanation: t(
        `When sets are described by rules, list each set from its rule first, then combine them. A number belongs to the union when it passes **at least one** of the two rules.

In $U = \\{1, 2, \\ldots, 10\\}$, let $A$ be the even numbers and $B$ the numbers greater than $7$. Then $A = \\{2, 4, 6, 8, 10\\}$ and $B = \\{8, 9, 10\\}$, and

$$A \\cup B = \\{2, 4, 6, 8, 9, 10\\},$$

the numbers that are even **or** greater than $7$. Only $9$ is added from $B$, since $8$ and $10$ are already in $A$: $5 + 3 - 2 = 6$ elements.

> **Watch out.** Apply each rule exactly, boundary included, before combining: "greater than $7$" does not include $7$. A wrong set going in gives a wrong union coming out.`,
        `集合由规则描述时，先按规则分别列出各集合，再合并。一个数只要满足两条规则中**至少一条**，就属于并集。

在 $U = \\{1, 2, \\ldots, 10\\}$ 中，设 $A$ 是偶数，$B$ 是大于 $7$ 的数。则 $A = \\{2, 4, 6, 8, 10\\}$，$B = \\{8, 9, 10\\}$，

$$A \\cup B = \\{2, 4, 6, 8, 9, 10\\},$$

即是偶数**或**大于 $7$ 的数。从 $B$ 中只添上 $9$，因为 $8$ 和 $10$ 已在 $A$ 中：$5 + 3 - 2 = 6$ 个元素。

> **注意。** 合并之前，要把每条规则（包括分界）准确地用好：“大于 $7$”不含 $7$。放进去的集合错了，得到的并集也会错。`,
      ),
      generate(rng) {
        const n = rng.int(10, 16);
        const u = range(1, n);
        for (;;) {
          const e1 = numberEvent(rng, n);
          const e2 = numberEvent(rng, n);
          const a = u.filter(e1.test);
          const b = u.filter(e2.test);
          const ab = union(a, b);
          if (a.length === 0 || b.length === 0 || intersection(a, b).length === 0 || ab.length === n || e1.en === e2.en) continue;
          if (a.every((x) => b.includes(x)) || b.every((x) => a.includes(x))) continue;
          const i = intersection(a, b);
          return {
            ...setProblem({
              prompt: t(
                `Let $U = \\{1, 2, \\ldots, ${n}\\}$. $A$ is the set of numbers in $U$ that are ${e1.en}, and $B$ the set of numbers in $U$ that are ${e2.en}. Find $A \\cup B$.${SET_EN}`,
                `设 $U = \\{1, 2, \\ldots, ${n}\\}$。$A$ 是 $U$ 中${e1.zh}的数组成的集合，$B$ 是 $U$ 中${e2.zh}的数组成的集合。求 $A \\cup B$。${SET_ZH}`,
              ),
              values: ab,
              wrong: [intersection(a, b), union(u.filter(e1.loose), b), union(a, u.filter(e2.loose))],
              solution: t(
                `${stepLabel(1, "list each set", "分别列出各集合").en} Test each number of $U$ against each rule: $A = ${setTex(a)}$ and $B = ${setTex(b)}$.

${stepLabel(2, "combine", "合并").en} A number is in $A \\cup B$ when it is shaded in row $A$ or in row $B$, or both:

{{figure 0}}${steps(`A \\cup B = ${setTex(ab)}`)}**Check.** $n(A) + n(B) - n(A \\cap B) = ${a.length} + ${b.length} - ${i.length} = ${ab.length}$: the $${i.length}$ shared number${i.length === 1 ? "" : "s"} $${i.join(", ")}$ ${i.length === 1 ? "is" : "are"} counted once.`,
                `${stepLabel(1, "list each set", "分别列出各集合")["zh-CN"]}用每条规则检验 $U$ 中的每个数：$A = ${setTex(a)}$，$B = ${setTex(b)}$。

${stepLabel(2, "combine", "合并")["zh-CN"]}一个数在 $A$ 行或 $B$ 行（或两行）中有阴影，就属于 $A \\cup B$：

{{figure 0}}${steps(`A \\cup B = ${setTex(ab)}`)}**检验。** $n(A) + n(B) - n(A \\cap B) = ${a.length} + ${b.length} - ${i.length} = ${ab.length}$：$${i.length}$ 个公共的数 $${i.join(", ")}$ 只算一次。`,
              ),
            }),
            solutionFigures: [
              rowsFigure(
                u,
                [
                  ["A", a],
                  ["B", b],
                  ["A∪B", ab],
                ],
                `The numbers 1 to ${n} in three rows: A shades ${a.join(", ")}; B shades ${b.join(", ")}; the union shades ${ab.join(", ")}.`,
                `1 到 ${n} 画三行：A 行涂出 ${a.join("、")}；B 行涂出 ${b.join("、")}；并集行涂出 ${ab.join("、")}。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "counting-a-union-from-a-venn-diagram",
      figure: geometryDrawings2["the-union-of-sets#counting-a-union-from-a-venn-diagram"],
      title: t("Counting a union from a Venn diagram", "由韦恩图计算并集的元素个数"),
      explanation: t(
        `$A \\cup B$ covers three regions of a Venn diagram: $A$ only, both, and $B$ only. Each element sits in exactly one region, so adding the three counts counts every element of the union once. The region outside both circles is not part of it.

With $12$ in $A$ only, $5$ in both, $18$ in $B$ only and $7$ outside: $n(A \\cup B) = 12 + 5 + 18 = 35$. Another route: everything except the outside, $42 - 7 = 35$.

> **Watch out.** Adding $n(A) + n(B) = 17 + 23 = 40$ counts the $5$ in the overlap twice, once with each circle; subtract it once. And leave out the $7$ outside both circles, which are in neither set.`,
        `$A \\cup B$ 覆盖韦恩图的三个区域：仅 $A$、两者、仅 $B$。每个元素恰好在一个区域中，所以把这三个数相加，并集的每个元素都只数一次。两圆之外的区域不属于并集。

仅 $A$ 有 $12$，两者都有 $5$，仅 $B$ 有 $18$，之外有 $7$：$n(A \\cup B) = 12 + 5 + 18 = 35$。另一种算法：除去外面的部分，$42 - 7 = 35$。

> **注意。** 计算 $n(A) + n(B) = 17 + 23 = 40$ 会把重叠部分的 $5$ 数两次（每个圆各一次），要减去一次。两圆之外的 $7$ 个不属于任何一个集合，不算。`,
      ),
      generate(rng) {
        const c = venn2Counts(rng);
        const n = c[0] + c[1] + c[2];
        const shade: Shading = { en: "both circles, the union", zh: "两个圆，即并集", test: (a, b) => a || b };
        return {
          ...numberProblem({
            prompt: t(
              "The Venn diagram shows the number of elements in each region. Find $n(A \\cup B)$.",
              "韦恩图标出了每个区域的元素个数。求 $n(A \\cup B)$。",
            ),
            answer: n,
            form: "integer",
            wrong: [sum(c)],
            mistakes: [
              why(n + c[1], "You counted the overlap twice. Count it once.", "你把重叠部分数了两次。它只应数一次。"),
              why(
                c[0] + c[2],
                "You left out the overlap. The union includes the elements in both sets.",
                "你漏掉了重叠部分。并集包含同时属于两个集合的元素。",
              ),
              why(
                c[1],
                "That is the intersection, the elements in both. The union takes those in either.",
                "这是交集，即同时属于两个集合的元素。并集包含属于任一集合的元素。",
              ),
            ],
            solution: t(
              `${stepLabel(1, "shade the union", "画出并集").en} $A \\cup B$ is everything inside the circles:

{{figure 0}}

${stepLabel(2, "add its regions", "把它的区域相加").en} Each element inside the circles is in exactly one of the three regions:${steps(`n(A \\cup B) = ${c[0]} + ${c[1]} + ${c[2]} = ${n}`)}**Check.** By the formula, $n(A) + n(B) - n(A \\cap B) = ${c[0] + c[1]} + ${c[1] + c[2]} - ${c[1]} = ${n}$. And with the $${c[3]}$ outside, $${n} + ${c[3]} = ${sum(c)}$ makes up the whole of $U$.`,
              `${stepLabel(1, "shade the union", "画出并集")["zh-CN"]}$A \\cup B$ 是两圆内的全部区域：

{{figure 0}}

${stepLabel(2, "add its regions", "把它的区域相加")["zh-CN"]}圆内的每个元素恰好在三个区域之一中：${steps(`n(A \\cup B) = ${c[0]} + ${c[1]} + ${c[2]} = ${n}`)}**检验。** 用公式，$n(A) + n(B) - n(A \\cap B) = ${c[0] + c[1]} + ${c[1] + c[2]} - ${c[1]} = ${n}$。再加上外面的 $${c[3]}$，$${n} + ${c[3]} = ${sum(c)}$，正是整个 $U$。`,
            ),
          }),
          figure: venn2Figure(c),
          solutionFigures: [venn2Figure(c, shade)],
        };
      },
    },
  ],
};

/** intersectionIntro draws the factors of 12 and of 18 in a Venn diagram with the overlap shaded. */
const intersectionIntro: Figure = listedVenn([1, 2, 3, 4, 6, 12], [1, 2, 3, 6, 9, 18], (a, b) => a && b, "the overlap", "重叠部分");

/** theIntersectionOfSets is outline topic 6.17.2. */
export const theIntersectionOfSets: TopicDef = {
  id: "the-intersection-of-sets",
  title: t("The Intersection of Sets", "集合的交集"),
  summary: t("Find the intersection of two or three sets, and recognize disjoint sets.", "求两个或三个集合的交集，并识别不相交的集合。"),
  prerequisites: ["the-union-of-sets"],
  encompasses: [{ topic: "sets", weight: 0.2 }],
  xp: 10,
  standards: ["CCSS.HSS.CP.A.1"],
  intro: t(
    `The union gathers what is in one set **or** the other. Its partner gathers what is in one set **and** the other: the elements the two sets share. Events built with "and" ask for this, such as "the student plays chess and plays the piano".

You have met it before without the name. The factors of $12$ are $\\{1, 2, 3, 4, 6, 12\\}$ and the factors of $18$ are $\\{1, 2, 3, 6, 9, 18\\}$. Their common factors sit in the overlap of the two circles:

{{figure 0}}

That set, $\\{1, 2, 3, 6\\}$, is the **intersection** of the two sets, written $A \\cap B$; its largest element, $6$, is the greatest common factor. When two sets share nothing at all, the intersection is the empty set $\\varnothing$ and the sets are **disjoint**. In this lesson we find intersections of listed and described sets, and of three sets at once.`,
    `并集收集属于这个集合**或**那个集合的元素。与它配对的运算收集既属于这个集合**又**属于那个集合的元素：两个集合共有的元素。带“且”的事件问的就是这个，例如“这名学生下象棋并且弹钢琴”。

你其实早已见过它，只是没有这个名字。$12$ 的因数是 $\\{1, 2, 3, 4, 6, 12\\}$，$18$ 的因数是 $\\{1, 2, 3, 6, 9, 18\\}$。它们的公因数位于两圆的重叠部分：

{{figure 0}}

这个集合 $\\{1, 2, 3, 6\\}$ 是两个集合的**交集**，记作 $A \\cap B$；其中最大的元素 $6$ 就是最大公因数。两个集合没有任何公共元素时，交集是空集 $\\varnothing$，这两个集合**不相交**。这节课我们求列举法和描述法给出的集合的交集，以及三个集合的交集。`,
  ),
  introFigures: [intersectionIntro],
  knowledgePoints: [
    {
      id: "listing-an-intersection",
      figure: geometryDrawings2["the-intersection-of-sets#listing-an-intersection"],
      title: t("Listing an intersection", "列举交集"),
      explanation: t(
        `The **intersection** $A \\cap B$ is the set of elements in $A$ **and** in $B$: those they have in common. In a Venn diagram it is the overlap of the circles. To list it, go through $A$ and keep each element that also appears in $B$.

$$\\{1, 3, 5, 7\\} \\cap \\{3, 4, 5, 6\\} = \\{3, 5\\}.$$

$1$ and $7$ are dropped because they are not in $B$. Sets with no common element are **disjoint**, and their intersection is empty: $\\{1, 2\\} \\cap \\{5, 6\\} = \\varnothing$.

> **Watch out.** The intersection keeps only the elements in **both** sets, not every element of either: that is the union. And when nothing is shared, the answer is $\\varnothing$, not one of the sets.`,
        `**交集** $A \\cap B$ 是既属于 $A$ **又**属于 $B$ 的元素组成的集合，即它们的公共元素。在韦恩图中它是两圆的重叠部分。列出交集时，逐个查看 $A$ 的元素，保留在 $B$ 中也出现的。

$$\\{1, 3, 5, 7\\} \\cap \\{3, 4, 5, 6\\} = \\{3, 5\\}.$$

$1$ 和 $7$ 被去掉，因为它们不在 $B$ 中。没有公共元素的集合叫**不相交**的集合，它们的交集是空集：$\\{1, 2\\} \\cap \\{5, 6\\} = \\varnothing$。

> **注意。** 交集只保留**两个**集合都有的元素，而不是任一集合的所有元素（那是并集）。没有公共元素时，答案是 $\\varnothing$，而不是其中一个集合。`,
      ),
      generate(rng) {
        const [a, b] = twoSets(rng, 0.15);
        const i = intersection(a, b);
        const dropped = difference(a, b);
        return {
          ...setProblem({
            prompt: t(
              `Let $A = ${setTex(a)}$ and $B = ${setTex(b)}$. Find $A \\cap B$.${SET_EN}`,
              `设 $A = ${setTex(a)}$，$B = ${setTex(b)}$。求 $A \\cap B$。${SET_ZH}`,
            ),
            values: i,
            wrong: [union(a, b), difference(a, b), difference(b, a)],
            solution: t(
              `${stepLabel(1, "look for each element of A in B", "在 B 中查找 A 的每个元素").en} ${i.length === 0 ? `None of $${a.join(", ")}$ is in $B$, so the circles do not overlap at all:` : `$${i.join(", ")}$ ${i.length === 1 ? "is" : "are"} in $B$ as well; $${dropped.join(", ")}$ ${dropped.length === 1 ? "is" : "are"} not. The shared elements form the overlap, shaded:`}

{{figure 0}}

${stepLabel(2, "list the intersection", "列出交集").en}${steps(`A \\cap B = ${setTex(i)}`)}${i.length === 0 ? "The sets are disjoint. " : ""}**Check.** Count the union and use the formula: $n(A \\cup B) = ${union(a, b).length}$, and $n(A) + n(B) - n(A \\cup B) = ${a.length} + ${b.length} - ${union(a, b).length} = ${i.length}$, the size of the intersection.`,
              `${stepLabel(1, "look for each element of A in B", "在 B 中查找 A 的每个元素")["zh-CN"]}${i.length === 0 ? `$${a.join(", ")}$ 都不在 $B$ 中，所以两圆完全不重叠：` : `$${i.join(", ")}$ 也在 $B$ 中；$${dropped.join(", ")}$ 不在。公共元素组成重叠部分（阴影）：`}

{{figure 0}}

${stepLabel(2, "list the intersection", "列出交集")["zh-CN"]}${steps(`A \\cap B = ${setTex(i)}`)}${i.length === 0 ? "两个集合不相交。" : ""}**检验。** 数出并集再用公式：$n(A \\cup B) = ${union(a, b).length}$，$n(A) + n(B) - n(A \\cup B) = ${a.length} + ${b.length} - ${union(a, b).length} = ${i.length}$，正是交集的元素个数。`,
            ),
          }),
          solutionFigures: [listedVenn(a, b, (x, y) => x && y, "the overlap, the intersection", "重叠部分，即交集")],
        };
      },
    },
    {
      id: "intersections-of-described-sets",
      title: t("Intersections of described sets", "由描述给出的集合的交集"),
      explanation: t(
        `List each set from its rule, then keep the common elements. A number belongs to the intersection when it passes **both** rules at once.

In $U = \\{1, 2, \\ldots, 12\\}$, the multiples of $3$ are $\\{3, 6, 9, 12\\}$ and the numbers at most $7$ are $\\{1, 2, \\ldots, 7\\}$. The numbers that are both are

$$\\{3, 6\\}.$$

Each passes both tests: $3$ and $6$ are multiples of $3$ and at most $7$, while $9$ and $12$ fail the second rule.

> **Watch out.** Read each boundary exactly before combining: "at most $7$" keeps $7$, "less than $7$" drops it, and a wrong boundary can add or remove a common element. And the answer is what the sets share, not everything in either.`,
        `先按规则列出各集合，再保留公共元素。一个数要同时满足**两条**规则，才属于交集。

在 $U = \\{1, 2, \\ldots, 12\\}$ 中，$3$ 的倍数是 $\\{3, 6, 9, 12\\}$，不大于 $7$ 的数是 $\\{1, 2, \\ldots, 7\\}$。两者都满足的数是

$$\\{3, 6\\}.$$

每个都通过两次检验：$3$ 和 $6$ 是 $3$ 的倍数，并且不大于 $7$；而 $9$ 和 $12$ 不满足第二条规则。

> **注意。** 合并之前要准确读出每个分界：“不大于 $7$”含 $7$，“小于 $7$”不含 $7$，分界错了可能多出或漏掉公共元素。答案是两个集合共有的元素，而不是任一集合的全部元素。`,
      ),
      generate(rng) {
        const n = rng.int(10, 20);
        const u = range(1, n);
        for (;;) {
          const e1 = numberEvent(rng, n);
          const e2 = numberEvent(rng, n);
          const a = u.filter(e1.test);
          const b = u.filter(e2.test);
          const i = intersection(a, b);
          if (a.length === 0 || b.length === 0 || e1.en === e2.en || i.length === a.length || i.length === b.length) continue;
          const ab = union(a, b);
          return {
            ...setProblem({
              prompt: t(
                `Let $U = \\{1, 2, \\ldots, ${n}\\}$. $A$ is the set of numbers in $U$ that are ${e1.en}, and $B$ the set of numbers in $U$ that are ${e2.en}. Find $A \\cap B$.${SET_EN}`,
                `设 $U = \\{1, 2, \\ldots, ${n}\\}$。$A$ 是 $U$ 中${e1.zh}的数组成的集合，$B$ 是 $U$ 中${e2.zh}的数组成的集合。求 $A \\cap B$。${SET_ZH}`,
              ),
              values: i,
              wrong: [union(a, b), intersection(u.filter(e1.loose), b), intersection(a, u.filter(e2.loose))],
              solution: t(
                `${stepLabel(1, "list each set", "分别列出各集合").en} Test each number of $U$ against each rule: $A = ${setTex(a)}$ and $B = ${setTex(b)}$.

${stepLabel(2, "keep the common elements", "保留公共元素").en} A number is in $A \\cap B$ when it is shaded in both row $A$ and row $B$:

{{figure 0}}${steps(`A \\cap B = ${setTex(i)}`)}${i.length === 0 ? "No number passes both rules, so the sets are disjoint. " : ""}**Check.** $n(A \\cup B) = ${ab.length}$, and $n(A) + n(B) - n(A \\cup B) = ${a.length} + ${b.length} - ${ab.length} = ${i.length}$, the size of the intersection.`,
                `${stepLabel(1, "list each set", "分别列出各集合")["zh-CN"]}用每条规则检验 $U$ 中的每个数：$A = ${setTex(a)}$，$B = ${setTex(b)}$。

${stepLabel(2, "keep the common elements", "保留公共元素")["zh-CN"]}一个数在 $A$ 行和 $B$ 行中都有阴影，才属于 $A \\cap B$：

{{figure 0}}${steps(`A \\cap B = ${setTex(i)}`)}${i.length === 0 ? "没有数同时满足两条规则，所以两个集合不相交。" : ""}**检验。** $n(A \\cup B) = ${ab.length}$，$n(A) + n(B) - n(A \\cup B) = ${a.length} + ${b.length} - ${ab.length} = ${i.length}$，正是交集的元素个数。`,
              ),
            }),
            solutionFigures: [
              rowsFigure(
                u,
                [
                  ["A", a],
                  ["B", b],
                  ["A∩B", i],
                ],
                `The numbers 1 to ${n} in three rows: A shades ${a.join(", ")}; B shades ${b.join(", ")}; the intersection shades ${i.join(", ") || "nothing"}.`,
                `1 到 ${n} 画三行：A 行涂出 ${a.join("、")}；B 行涂出 ${b.join("、")}；交集行涂出 ${i.join("、") || "无"}。`,
              ),
            ],
          };
        }
      },
    },
    {
      id: "intersections-of-three-sets",
      title: t("Intersections of three sets", "三个集合的交集"),
      explanation: t(
        `$A \\cap B \\cap C$ holds the elements in all three sets. Intersect two at a time: find $A \\cap B$ first, then keep those of its elements that are also in $C$. Each step can only remove elements, so the result is never larger than any of the sets.

For $A = \\{2, 4, 6, 8, 10\\}$, $B = \\{1, 2, 3, 4, 5, 6\\}$, $C = \\{4, 5, 6, 7\\}$: $A \\cap B = \\{2, 4, 6\\}$, and of these only $4$ and $6$ are in $C$, so $A \\cap B \\cap C = \\{4, 6\\}$. The order does not matter: $B \\cap C = \\{4, 5, 6\\}$, and keeping its elements in $A$ gives $\\{4, 6\\}$ too.

> **Watch out.** Stopping after $A \\cap B$ forgets the third set: an element must be in $C$ as well. And an element in two of the sets but not the third, such as $2$ here, is left out.`,
        `$A \\cap B \\cap C$ 由同时属于三个集合的元素组成。每次求两个集合的交集：先求 $A \\cap B$，再保留其中也属于 $C$ 的元素。每一步只会去掉元素，所以结果不会比任何一个集合大。

对于 $A = \\{2, 4, 6, 8, 10\\}$，$B = \\{1, 2, 3, 4, 5, 6\\}$，$C = \\{4, 5, 6, 7\\}$：$A \\cap B = \\{2, 4, 6\\}$，其中只有 $4$ 和 $6$ 在 $C$ 中，所以 $A \\cap B \\cap C = \\{4, 6\\}$。顺序无关紧要：$B \\cap C = \\{4, 5, 6\\}$，保留其中属于 $A$ 的元素，同样得到 $\\{4, 6\\}$。

> **注意。** 求出 $A \\cap B$ 就停下，会忘了第三个集合：元素还必须属于 $C$。只属于其中两个集合而不属于第三个的元素（例如这里的 $2$）要去掉。`,
      ),
      generate(rng) {
        for (;;) {
          const pool = range(1, 15);
          const a = unique(rng.sample(pool, rng.int(4, 8)));
          const b = unique(rng.sample(pool, rng.int(4, 8)));
          const c = unique(rng.sample(pool, rng.int(4, 8)));
          const ab = intersection(a, b);
          const abc = intersection(ab, c);
          if (ab.length < 2 || ab.length === abc.length) continue;
          if (abc.length === 0 && !rng.bool(0.15)) continue;
          const bc = intersection(b, c);
          const out = difference(ab, c);
          return setProblem({
            prompt: t(
              `Let $A = ${setTex(a)}$, $B = ${setTex(b)}$ and $C = ${setTex(c)}$. Find $A \\cap B \\cap C$.${SET_EN}`,
              `设 $A = ${setTex(a)}$，$B = ${setTex(b)}$，$C = ${setTex(c)}$。求 $A \\cap B \\cap C$。${SET_ZH}`,
            ),
            values: abc,
            wrong: [ab, intersection(a, c), intersection(b, c), union(ab, c)],
            solution: t(
              `${stepLabel(1, "intersect A and B", "求 A 与 B 的交集").en} Keep the elements of $A$ that are also in $B$:${steps(`A \\cap B = ${setTex(ab)}`)}${stepLabel(2, "keep those in C", "保留属于 C 的元素").en} Of these, $${out.join(", ")}$ ${out.length === 1 ? "is" : "are"} not in $C$ and ${out.length === 1 ? "drops" : "drop"} out:${steps(`A \\cap B \\cap C = ${setTex(abc)}`)}${abc.length === 0 ? "No element is in all three sets. " : ""}**Check.** Go the other way round: $B \\cap C = ${setTex(bc)}$, and keeping its elements that are in $A$ gives $${setTex(intersection(bc, a))}$ again.`,
              `${stepLabel(1, "intersect A and B", "求 A 与 B 的交集")["zh-CN"]}保留 $A$ 中也属于 $B$ 的元素：${steps(`A \\cap B = ${setTex(ab)}`)}${stepLabel(2, "keep those in C", "保留属于 C 的元素")["zh-CN"]}其中 $${out.join(", ")}$ 不在 $C$ 中，去掉：${steps(`A \\cap B \\cap C = ${setTex(abc)}`)}${abc.length === 0 ? "没有元素同时属于三个集合。" : ""}**检验。** 换个顺序：$B \\cap C = ${setTex(bc)}$，保留其中属于 $A$ 的元素，同样得到 $${setTex(intersection(bc, a))}$。`,
            ),
          });
        }
      },
    },
  ],
};

/** TwoWay is the setting of a two-way table: who, the row property and its negation, the column property and its negation. */
interface TwoWay {
  readonly who: Text;
  readonly rows: readonly [Text, Text];
  readonly cols: readonly [Text, Text];
}

const twoWays: readonly TwoWay[] = [
  {
    who: t("students", "学生"),
    rows: [t("plays an instrument", "会演奏乐器"), t("does not play an instrument", "不会演奏乐器")],
    cols: [t("plays a sport", "参加运动"), t("does not play a sport", "不参加运动")],
  },
  {
    who: t("adults", "成年人"),
    rows: [t("owns a car", "有汽车"), t("does not own a car", "没有汽车")],
    cols: [t("lives in the city", "住在城里"), t("lives outside the city", "住在城外")],
  },
  {
    who: t("visitors to a museum", "博物馆参观者"),
    rows: [t("is an adult", "是成人"), t("is a child", "是儿童")],
    cols: [t("bought a ticket online", "在网上买票"), t("bought a ticket at the door", "在门口买票")],
  },
  {
    who: t("customers of a café", "咖啡馆顾客"),
    rows: [t("ordered a hot drink", "点了热饮"), t("ordered a cold drink", "点了冷饮")],
    cols: [t("ordered food", "点了食物"), t("did not order food", "没点食物")],
  },
];

/** twoWayTable writes a two-way table of counts in Markdown, with the cells at the indices boxed boxed. */
function twoWayTable(w: TwoWay, c: readonly number[], lang: "en" | "zh-CN", boxed: readonly number[] = []): string {
  const cap = (s: string) => (lang === "en" ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  const cell = (i: number) => (boxed.includes(i) ? `$\\boxed{${c[i]}}$` : `$${c[i]}$`);
  return `| | ${cap(w.cols[0][lang])} | ${cap(w.cols[1][lang])} |\n| :--- | :--- | :--- |\n| ${cap(w.rows[0][lang])} | ${cell(0)} | ${cell(1)} |\n| ${cap(w.rows[1][lang])} | ${cell(2)} | ${cell(3)} |`;
}

/** tableVenn sorts the cells of a two-way table into the regions of a Venn diagram, with A the row property r and B the column property k. */
const tableVenn = (c: readonly number[], r: number, k: number): Venn2 => [
  c[2 * r + 1 - k]!,
  c[2 * r + k]!,
  c[2 * (1 - r) + k]!,
  c[2 * (1 - r) + 1 - k]!,
];

/** twoWayIntro draws the glasses and handedness survey as a Venn diagram, with the "or" event shaded. */
const twoWayIntro: Figure = venn2Figure([11, 4, 6, 29], {
  en: "everything inside the circles",
  zh: "两圆内的全部区域",
  test: (a, b) => a || b,
});

/** compoundEventsInProbabilityFromExperimentalData is outline topic 6.17.3. */
export const compoundEventsInProbabilityFromExperimentalData: TopicDef = {
  id: "compound-events-in-probability-from-experimental-data",
  title: t("Compound Events in Probability From Experimental Data", "由试验数据求复合事件的概率"),
  summary: t('Find experimental probabilities of "and" and "or" events from a two-way table.', "由双向表求“且”事件和“或”事件的试验概率。"),
  prerequisites: ["the-intersection-of-sets", "experimental-probability"],
  encompasses: [
    { topic: "experimental-probability", weight: 0.4 },
    { topic: "the-intersection-of-sets", weight: 0.2 },
    { topic: "the-union-of-sets", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.A.4", "CCSS.HSS.CP.B.7"],
  intro: t(
    `A survey often records two things about each person at once. A teacher asked $50$ students whether they wear glasses and which hand they write with:

| | Left-handed | Right-handed |
| :--- | :--- | :--- |
| Wears glasses | $4$ | $11$ |
| No glasses | $6$ | $29$ |

Each student is in exactly one cell, so the four cells add to $4 + 11 + 6 + 29 = 50$. The table is a Venn diagram in disguise: with $A$ "wears glasses" and $B$ "left-handed", the cell for both is the overlap, and the other cells are $A$ only, $B$ only and neither. The event "wears glasses **or** is left-handed" is everything inside the circles:

{{figure 0}}

So a student chosen at random wears glasses and is left-handed with probability $\\frac{4}{50} = \\frac{2}{25}$, and wears glasses or is left-handed with probability $\\frac{4 + 11 + 6}{50} = \\frac{21}{50}$. Because the counts come from a survey, these are experimental probabilities. In this lesson we read "and" events and "or" events from two-way tables.`,
    `调查常常同时记录每个人的两件事。一位老师询问了 $50$ 名学生是否戴眼镜、用哪只手写字：

| | 左撇子 | 右利手 |
| :--- | :--- | :--- |
| 戴眼镜 | $4$ | $11$ |
| 不戴眼镜 | $6$ | $29$ |

每名学生恰好在一个单元格中，所以四个单元格之和为 $4 + 11 + 6 + 29 = 50$。这张表其实就是一个韦恩图：设 $A$ 为“戴眼镜”，$B$ 为“左撇子”，两者都有的单元格是重叠部分，其余单元格分别是仅 $A$、仅 $B$ 和两者都不。事件“戴眼镜**或**是左撇子”是两圆内的全部区域：

{{figure 0}}

所以随机选一名学生，既戴眼镜又是左撇子的概率是 $\\frac{4}{50} = \\frac{2}{25}$，戴眼镜或是左撇子的概率是 $\\frac{4 + 11 + 6}{50} = \\frac{21}{50}$。这些数来自调查，所以是试验概率。这节课我们由双向表求“且”事件和“或”事件的概率。`,
  ),
  introFigures: [twoWayIntro],
  knowledgePoints: [
    {
      id: "and-events-from-a-table",
      title: t('"And" events from a table', "由表格求“且”事件的概率"),
      explanation: t(
        `A **two-way table** counts people (or trials) by two properties at once. Each person falls in exactly one cell: the cell of their row property **and** their column property. So the people with both properties are exactly one cell, and since each person is equally likely to be chosen,

$$P(\\text{row and column}) = \\frac{\\text{the cell}}{\\text{the total of all four cells}}$$

| | Plays a sport | Does not play a sport |
| :--- | :--- | :--- |
| Plays an instrument | $12$ | $18$ |
| Does not play an instrument | $25$ | $5$ |

There are $12 + 18 + 25 + 5 = 60$ students, so the probability that a random one plays an instrument and a sport is $\\frac{12}{60} = \\frac{1}{5}$. Adding by rows, $30 + 30 = 60$, confirms the total.

> **Watch out.** Divide by the total of **all four** cells. Dividing by the row total, $\\frac{12}{30}$, answers a different question: the probability of a sport among those who already play an instrument.`,
        `**双向表**按两种属性同时统计人数（或试验次数）。每个人恰好落在一个单元格中：他的行属性**且**列属性对应的那一格。所以同时具有两种属性的人正好是一个单元格；每个人被选中的可能性相同，因此

$$P(\\text{行且列}) = \\frac{\\text{该单元格}}{\\text{四个单元格之和}}$$

| | 参加运动 | 不参加运动 |
| :--- | :--- | :--- |
| 会演奏乐器 | $12$ | $18$ |
| 不会演奏乐器 | $25$ | $5$ |

共有 $12 + 18 + 25 + 5 = 60$ 名学生，所以随机一名学生既会演奏乐器又参加运动的概率是 $\\frac{12}{60} = \\frac{1}{5}$。按行相加 $30 + 30 = 60$，总数得到确认。

> **注意。** 要除以**四个**单元格的总和。除以行合计 $\\frac{12}{30}$ 回答的是另一个问题：在会演奏乐器的人中参加运动的概率。`,
      ),
      generate(rng) {
        const w = rng.pick(twoWays);
        const c = [rng.int(3, 40), rng.int(3, 40), rng.int(3, 40), rng.int(3, 40)];
        const total = sum(c);
        const r = rng.int(0, 1);
        const k = rng.int(0, 1);
        const at = 2 * r + k;
        const cell = c[at]!;
        const rowTotal = c[2 * r]! + c[2 * r + 1]!;
        const colTotal = c[k]! + c[2 + k]!;
        const rows = [c[0]! + c[1]!, c[2]! + c[3]!];
        const both: Shading = { en: "the overlap", zh: "重叠部分", test: (a, b) => a && b };
        return {
          ...probProblem(
            t(
              `A survey of ${w.who.en} gave these counts:\n\n${twoWayTable(w, c, "en")}\n\nOne of them is chosen at random. What is the probability that the person ${w.rows[r]!.en} and ${w.cols[k]!.en}?`,
              `对${w.who["zh-CN"]}的调查结果如下：\n\n${twoWayTable(w, c, "zh-CN")}\n\n从中随机选一人，此人${w.rows[r]!["zh-CN"]}且${w.cols[k]!["zh-CN"]}的概率是多少？`,
            ),
            Q.of(cell, total),
            t(
              `${stepLabel(1, "find the cell", "找出单元格").en} Let $A$ be "${w.rows[r]!.en}" and $B$ "${w.cols[k]!.en}". The people with both properties sit where that row meets that column, boxed:

${twoWayTable(w, c, "en", [at])}

In a Venn diagram of the same counts, this cell is the overlap $A \\cap B$:

{{figure 0}}

${stepLabel(2, "divide by the total", "除以总数").en} Every person is equally likely to be chosen, so divide by all four cells, $${c.join(" + ")} = ${total}$:${steps(`P(A \\cap B) = ${ratio(cell, total)}`)}**Check.** Add the people a second way, by rows: $${rows[0]} + ${rows[1]} = ${total}$, the same total. And $${cell}$ is no more than the row total $${rowTotal}$ or the column total $${colTotal}$, so the answer lies between $0$ and $1$ and is no larger than the probability of either property alone.`,
              `${stepLabel(1, "find the cell", "找出单元格")["zh-CN"]}设 $A$ 为“${w.rows[r]!["zh-CN"]}”，$B$ 为“${w.cols[k]!["zh-CN"]}”。同时具有两种属性的人在该行与该列相交的单元格（方框）：

${twoWayTable(w, c, "zh-CN", [at])}

在同样人数的韦恩图中，这个单元格就是重叠部分 $A \\cap B$：

{{figure 0}}

${stepLabel(2, "divide by the total", "除以总数")["zh-CN"]}每个人被选中的可能性相同，所以除以四个单元格之和 $${c.join(" + ")} = ${total}$：${steps(`P(A \\cap B) = ${ratio(cell, total)}`)}**检验。** 换一种方法按行求总数：$${rows[0]} + ${rows[1]} = ${total}$，总数相同。并且 $${cell}$ 不超过行合计 $${rowTotal}$ 和列合计 $${colTotal}$，所以答案在 $0$ 与 $1$ 之间，也不大于单独任一属性的概率。`,
            ),
            [Q.of(cell, rowTotal), Q.of(cell, colTotal), Q.of(rowTotal + colTotal - cell, total), Q.of(rowTotal, total)],
          ),
          solutionFigures: [venn2Figure(tableVenn(c, r, k), both)],
        };
      },
    },
    {
      id: "or-events-from-a-table",
      title: t('"Or" events from a table', "由表格求“或”事件的概率"),
      explanation: t(
        `"Row **or** column" means at least one of the two properties. Three of the four cells qualify: the two cells of the row, and the other cell of the column. Only the cell with **neither** property is left out. Equivalently, add the row total and the column total, then subtract the shared cell, which both totals contain.

In the table of the previous step, the students who play an instrument or a sport are $12 + 18 + 25 = 55$ (equivalently, $30 + 37 - 12 = 55$), so the probability is $\\frac{55}{60} = \\frac{11}{12}$. The one cell left out, those who do neither, holds $5 = 60 - 55$.

> **Watch out.** Adding the row total and the column total, $30 + 37 = 67$, counts the $12$ students with both properties twice; it can even exceed the total. Subtract the shared cell once.`,
        `“行**或**列”指至少具有两种属性之一。四个单元格中有三个符合：该行的两个单元格，以及该列的另一个单元格。只有**两种属性都没有**的单元格被排除。等价地，把行合计与列合计相加，再减去两个合计都包含的公共单元格。

在上一步的表格中，会演奏乐器或参加运动的学生有 $12 + 18 + 25 = 55$ 名（也可以算 $30 + 37 - 12 = 55$），所以概率是 $\\frac{55}{60} = \\frac{11}{12}$。被排除的那一格（两者都不）有 $5 = 60 - 55$ 人。

> **注意。** 把行合计与列合计相加 $30 + 37 = 67$，会把两种属性都有的 $12$ 名学生算两次，甚至可能超过总数。公共单元格要减去一次。`,
      ),
      generate(rng) {
        const w = rng.pick(twoWays);
        const c = [rng.int(3, 40), rng.int(3, 40), rng.int(3, 40), rng.int(3, 40)];
        const total = sum(c);
        const r = rng.int(0, 1);
        const k = rng.int(0, 1);
        const cell = c[2 * r + k]!;
        const rowTotal = c[2 * r]! + c[2 * r + 1]!;
        const colTotal = c[k]! + c[2 + k]!;
        const n = rowTotal + colTotal - cell;
        const out = c[2 * (1 - r) + 1 - k]!;
        const boxed = [2 * r, 2 * r + 1, 2 * (1 - r) + k];
        const either: Shading = { en: "everything inside the circles", zh: "两圆内的全部区域", test: (a, b) => a || b };
        return {
          ...probProblem(
            t(
              `A survey of ${w.who.en} gave these counts:\n\n${twoWayTable(w, c, "en")}\n\nOne of them is chosen at random. What is the probability that the person ${w.rows[r]!.en} or ${w.cols[k]!.en}?`,
              `对${w.who["zh-CN"]}的调查结果如下：\n\n${twoWayTable(w, c, "zh-CN")}\n\n从中随机选一人，此人${w.rows[r]!["zh-CN"]}或${w.cols[k]!["zh-CN"]}的概率是多少？`,
            ),
            Q.of(n, total),
            t(
              `${stepLabel(1, "find the cells", "找出单元格").en} Let $A$ be "${w.rows[r]!.en}" and $B$ "${w.cols[k]!.en}". A person counts if they have at least one of the properties: the whole row and the rest of the column, boxed:

${twoWayTable(w, c, "en", boxed)}

In a Venn diagram of the same counts, these cells are everything inside the circles:

{{figure 0}}

${stepLabel(2, "count and divide", "计数并相除").en} The row has $${rowTotal}$ people and the column $${colTotal}$, with $${cell}$ in both, counted in each: $${rowTotal} + ${colTotal} - ${cell} = ${n}$ of the $${total}$.${steps(`P(A \\cup B) = ${ratio(n, total)}`)}**Check.** The only cell left out holds the people with neither property, $${out}$, and $${total} - ${n} = ${out}$: the count agrees by the second route.`,
              `${stepLabel(1, "find the cells", "找出单元格")["zh-CN"]}设 $A$ 为“${w.rows[r]!["zh-CN"]}”，$B$ 为“${w.cols[k]!["zh-CN"]}”。至少具有一种属性的人都算：整行，加上该列的另一格（方框）：

${twoWayTable(w, c, "zh-CN", boxed)}

在同样人数的韦恩图中，这些单元格就是两圆内的全部区域：

{{figure 0}}

${stepLabel(2, "count and divide", "计数并相除")["zh-CN"]}该行有 $${rowTotal}$ 人，该列有 $${colTotal}$ 人，两者都有的 $${cell}$ 人在两边各算了一次：共 $${rowTotal} + ${colTotal} - ${cell} = ${n}$ 人，总数 $${total}$。${steps(`P(A \\cup B) = ${ratio(n, total)}`)}**检验。** 唯一被排除的单元格是两种属性都没有的 $${out}$ 人，而 $${total} - ${n} = ${out}$：用另一种方法计数结果一致。`,
            ),
            [Q.of(rowTotal + colTotal, total), Q.of(cell, total), Q.of(n - cell, total)],
          ),
          solutionFigures: [venn2Figure(tableVenn(c, r, k), either)],
        };
      },
    },
  ],
};

/** compoundIntro draws a survey of 30 with the union of A and B shaded. */
const compoundIntro: Figure = venn2Figure([9, 4, 11, 6], {
  en: "everything inside the circles",
  zh: "两圆内的全部区域",
  test: (a, b) => a || b,
});

/** computingProbabilitiesForCompoundEventsUsingVennDiagrams is outline topic 6.17.4. */
export const computingProbabilitiesForCompoundEventsUsingVennDiagrams: TopicDef = {
  id: "computing-probabilities-for-compound-events-using-venn-diagrams",
  title: t("Computing Probabilities for Compound Events Using Venn Diagrams", "用韦恩图求复合事件的概率"),
  summary: t(
    "Find P(A ∩ B), P(A ∪ B) and the probability of exactly one event from a Venn diagram.",
    "由韦恩图求 P(A ∩ B)、P(A ∪ B) 以及恰好一个事件发生的概率。",
  ),
  prerequisites: ["the-intersection-of-sets"],
  encompasses: [
    { topic: "the-intersection-of-sets", weight: 0.2 },
    { topic: "the-union-of-sets", weight: 0.2 },
    { topic: "venn-diagrams-in-probability", weight: 0.5 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.A.1"],
  intro: t(
    `A Venn diagram of counts turns every event about $A$ and $B$ into a set of regions. To find a probability, shade the regions of the event, add their counts, and divide by the total of all four regions.

In a club of $30$ students, $A$ is "plays chess" and $B$ is "plays the piano": $9$ play chess only, $4$ both, $11$ the piano only, and $6$ neither. The event "$A$ or $B$" is everything inside the circles:

{{figure 0}}

The shaded regions hold $9 + 4 + 11 = 24$ students, so $P(A \\cup B) = \\frac{24}{30} = \\frac{4}{5}$. The unshaded region holds the other $6$, and $\\frac{24}{30} + \\frac{6}{30} = 1$, as it must. In this lesson we find the probabilities of "$A$ and $B$", "$A$ or $B$" and "exactly one" this way.`,
    `由人数组成的韦恩图把关于 $A$、$B$ 的每个事件都变成一组区域。求概率时，把事件的区域画上阴影，把它们的人数相加，再除以四个区域的总人数。

一个社团有 $30$ 名学生，$A$ 表示“下国际象棋”，$B$ 表示“弹钢琴”：仅下棋 $9$ 人，两者都会 $4$ 人，仅弹钢琴 $11$ 人，两者都不会 $6$ 人。事件“$A$ 或 $B$”是两圆内的全部区域：

{{figure 0}}

阴影区域共有 $9 + 4 + 11 = 24$ 人，所以 $P(A \\cup B) = \\frac{24}{30} = \\frac{4}{5}$。没有阴影的区域是另外 $6$ 人，$\\frac{24}{30} + \\frac{6}{30} = 1$，正应如此。这节课我们用这种方法求“$A$ 且 $B$”“$A$ 或 $B$”和“恰好一个”的概率。`,
  ),
  introFigures: [compoundIntro],
  knowledgePoints: [
    {
      id: "intersections-from-a-venn-diagram",
      title: t("P(A ∩ B) from a Venn diagram", "由韦恩图求 P(A ∩ B)"),
      explanation: t(
        `The event "$A$ and $B$" happens when the person chosen has **both** properties. Only the overlap of the circles holds such people, so the event is the intersection $A \\cap B$. Each person is equally likely to be chosen, so its probability is the overlap count over the total of all four regions, the region outside the circles included.

In the diagram, the total is $12 + 5 + 18 + 7 = 42$, so $P(A \\cap B) = \\frac{5}{42}$.

> **Watch out.** The denominator is everyone in $U$, not just circle $A$: $\\frac{5}{17}$ would be the share of $A$ that is also in $B$. And do not add the whole circles; "and" keeps only the overlap.`,
        `事件“$A$ 且 $B$”发生，指选中的人**同时**具有两种属性。只有两圆的重叠部分里是这样的人，所以这个事件就是交集 $A \\cap B$。每个人被选中的可能性相同，所以它的概率是重叠部分的人数除以四个区域（包括圆外区域）的总人数。

在图中，总人数是 $12 + 5 + 18 + 7 = 42$，所以 $P(A \\cap B) = \\frac{5}{42}$。

> **注意。** 分母是 $U$ 中的所有人，而不只是圆 $A$：$\\frac{5}{17}$ 是 $A$ 中同时属于 $B$ 的比例。也不要把整个圆加起来；“且”只保留重叠部分。`,
      ),
      figure: venn2Figure([12, 5, 18, 7]),
      generate(rng) {
        const s = rng.pick(surveys);
        const c = venn2Counts(rng);
        const total = sum(c);
        const e: VennEvent = { tex: "A \\cap B", en: "the overlap of the circles", zh: "两圆的重叠部分", test: (a, b) => a && b };
        return {
          ...probProblem(
            t(`${surveyPrompt(s, total).en} Find $P(A \\cap B)$.`, `${surveyPrompt(s, total)["zh-CN"]}求 $P(A \\cap B)$。`),
            Q.of(c[1], total),
            vennSolution(c, e),
            [Q.of(c[1], total - c[3]), Q.of(c[0] + c[1] + c[2], total), Q.of(c[0] + 2 * c[1] + c[2], total), Q.of(c[1], c[0] + c[1])],
          ),
          figure: venn2Figure(c),
          solutionFigures: [venn2Figure(c, e)],
        };
      },
    },
    {
      id: "unions-from-a-venn-diagram",
      figure: geometryDrawings2["computing-probabilities-for-compound-events-using-venn-diagrams#unions-from-a-venn-diagram"],
      title: t("P(A ∪ B) from a Venn diagram", "由韦恩图求 P(A ∪ B)"),
      explanation: t(
        `The event "$A$ or $B$" happens when the person has **at least one** of the properties: $A$ only, $B$ only, or both. These are the three regions inside the circles, so the event is the union $A \\cup B$. Add the three regions, the overlap once, and divide by the total.

In the diagram of the previous step, $P(A \\cup B) = \\frac{12 + 5 + 18}{42} = \\frac{35}{42} = \\frac{5}{6}$. As a check, only the $7$ outside the circles are left out, and $35 + 7 = 42$.

> **Watch out.** Adding the two whole circles, $(12 + 5) + (5 + 18) = 40$, counts the $5$ in the overlap twice. Add regions, not circles.`,
        `事件“$A$ 或 $B$”发生，指此人**至少**具有一种属性：仅 $A$、仅 $B$ 或两者都有。这是两圆内的三个区域，所以这个事件就是并集 $A \\cup B$。把三个区域相加（重叠部分算一次），再除以总人数。

在上一步的图中，$P(A \\cup B) = \\frac{12 + 5 + 18}{42} = \\frac{35}{42} = \\frac{5}{6}$。检验：只有圆外的 $7$ 人被排除，$35 + 7 = 42$。

> **注意。** 把两个整圆相加 $(12 + 5) + (5 + 18) = 40$，会把重叠部分的 $5$ 人算两次。要按区域相加，而不是按圆相加。`,
      ),
      generate(rng) {
        const s = rng.pick(surveys);
        const c = venn2Counts(rng);
        const total = sum(c);
        const e: VennEvent = { tex: "A \\cup B", en: "everything inside the circles", zh: "两圆内的全部区域", test: (a, b) => a || b };
        const n = c[0] + c[1] + c[2];
        return {
          ...probProblem(
            t(`${surveyPrompt(s, total).en} Find $P(A \\cup B)$.`, `${surveyPrompt(s, total)["zh-CN"]}求 $P(A \\cup B)$。`),
            Q.of(n, total),
            vennSolution(c, e),
            [Q.of(n + c[1], total), Q.of(c[0] + c[2], total), Q.of(c[1], total), Q.of(c[3], total)],
          ),
          figure: venn2Figure(c),
          solutionFigures: [venn2Figure(c, e)],
        };
      },
    },
    {
      id: "exactly-one-event",
      title: t("Exactly one of the events", "恰好一个事件发生"),
      explanation: t(
        `"Exactly one of $A$ and $B$" means $A$ or $B$ but **not both**. The overlap holds people with both properties, so it is left out, and so is the region outside the circles: the event is the two crescent regions, $A$ only and $B$ only. "$A$ but not $B$" is the crescent of $A$ alone.

In the diagram of the first step, $P(\\text{exactly one}) = \\frac{12 + 18}{42} = \\frac{30}{42} = \\frac{5}{7}$, and $P(A \\text{ only}) = \\frac{12}{42} = \\frac{2}{7}$.

> **Watch out.** "Exactly one" is not "$A$ or $B$": the union, $\\frac{35}{42}$, also counts the $5$ who have both. And "$A$ but not $B$" is not the whole circle $A$, $\\frac{17}{42}$.`,
        `“$A$、$B$ 恰好发生一个”指 $A$ 或 $B$ 发生但**不同时**发生。重叠部分是两种属性都有的人，要排除；圆外的区域也要排除：这个事件是两个月牙形区域，仅 $A$ 和仅 $B$。“$A$ 发生而 $B$ 不发生”只是 $A$ 的月牙形区域。

在第一步的图中，$P(\\text{恰好一个}) = \\frac{12 + 18}{42} = \\frac{30}{42} = \\frac{5}{7}$，$P(\\text{仅 } A) = \\frac{12}{42} = \\frac{2}{7}$。

> **注意。** “恰好一个”不是“$A$ 或 $B$”：并集 $\\frac{35}{42}$ 还包括两者都有的 $5$ 人。“$A$ 发生而 $B$ 不发生”也不是整个圆 $A$ 的 $\\frac{17}{42}$。`,
      ),
      generate(rng) {
        const s = rng.pick(surveys);
        const c = venn2Counts(rng);
        const total = sum(c);
        const kind = rng.int(0, 2);
        const [en, zh, n] =
          kind === 0
            ? ["exactly one of $A$ and $B$ happens", "$A$、$B$ 恰好发生一个", c[0] + c[2]]
            : kind === 1
              ? ["$A$ happens but $B$ does not", "$A$ 发生而 $B$ 不发生", c[0]]
              : ["$B$ happens but $A$ does not", "$B$ 发生而 $A$ 不发生", c[2]];
        const e: VennEvent =
          kind === 0
            ? {
                tex: "(A \\cap B') \\cup (A' \\cap B)",
                en: "the two crescents, $A$ only and $B$ only, without the overlap",
                zh: "两个月牙形区域（仅 $A$ 和仅 $B$），不含重叠部分",
                test: (a, b) => a !== b,
              }
            : kind === 1
              ? {
                  tex: "A \\cap B'",
                  en: "the crescent of $A$, without the overlap",
                  zh: "$A$ 的月牙形区域，不含重叠部分",
                  test: (a, b) => a && !b,
                }
              : {
                  tex: "A' \\cap B",
                  en: "the crescent of $B$, without the overlap",
                  zh: "$B$ 的月牙形区域，不含重叠部分",
                  test: (a, b) => !a && b,
                };
        return {
          ...probProblem(
            t(`${surveyPrompt(s, total).en} What is the probability that ${en}?`, `${surveyPrompt(s, total)["zh-CN"]}${zh}的概率是多少？`),
            Q.of(n, total),
            vennSolution(c, e),
            [Q.of(c[0] + c[1] + c[2], total), Q.of(kind === 2 ? c[1] + c[2] : c[0] + c[1], total), Q.of(c[1], total)],
          ),
          figure: venn2Figure(c),
          solutionFigures: [venn2Figure(c, e)],
        };
      },
    },
  ],
};

/** complementEvents are the events with complements asked about in a two-set Venn diagram. */
const complementEvents: readonly VennEvent[] = [
  { tex: "A'", en: "everything outside circle $A$", zh: "圆 $A$ 之外的全部区域", test: (a) => !a },
  { tex: "B'", en: "everything outside circle $B$", zh: "圆 $B$ 之外的全部区域", test: (_, b) => !b },
  { tex: "(A \\cup B)'", en: "the region outside both circles", zh: "两圆之外的区域", test: (a, b) => !a && !b },
  { tex: "(A \\cap B)'", en: "everything except the overlap", zh: "除重叠部分以外的全部区域", test: (a, b) => !(a && b) },
  { tex: "A \\cap B'", en: "the part of $A$ outside $B$", zh: "$A$ 中在 $B$ 之外的部分", test: (a, b) => a && !b },
  { tex: "A' \\cap B", en: "the part of $B$ outside $A$", zh: "$B$ 中在 $A$ 之外的部分", test: (a, b) => !a && b },
  { tex: "A' \\cap B'", en: "the region outside both circles", zh: "两圆之外的区域", test: (a, b) => !a && !b },
  { tex: "A \\cup B'", en: "circle $A$ together with everything outside $B$", zh: "圆 $A$ 与 $B$ 之外的全部区域", test: (a, b) => a || !b },
  { tex: "A' \\cup B", en: "circle $B$ together with everything outside $A$", zh: "圆 $B$ 与 $A$ 之外的全部区域", test: (a, b) => !a || b },
  { tex: "A' \\cup B'", en: "everything except the overlap", zh: "除重叠部分以外的全部区域", test: (a, b) => !a || !b },
];

/** complementsIntro draws a survey of 25 with everything outside circle A shaded. */
const complementsIntro: Figure = venn2Figure([8, 3, 10, 4], {
  en: "everything outside circle A",
  zh: "圆 A 之外的全部区域",
  test: (a) => !a,
});

/** computingProbabilitiesOfEventsContainingComplementsUsingVennDiagrams is outline topic 6.17.5. */
export const computingProbabilitiesOfEventsContainingComplementsUsingVennDiagrams: TopicDef = {
  id: "computing-probabilities-of-events-containing-complements-using-venn-diagrams",
  title: t("Computing Probabilities of Events Containing Complements Using Venn Diagrams", "用韦恩图求含对立事件的概率"),
  summary: t(
    "Find probabilities of events such as A ∩ B', A' ∪ B and (A ∪ B)' from a Venn diagram.",
    "由韦恩图求 A ∩ B'、A' ∪ B、(A ∪ B)' 等事件的概率。",
  ),
  prerequisites: ["computing-probabilities-for-compound-events-using-venn-diagrams"],
  encompasses: [
    { topic: "computing-probabilities-for-compound-events-using-venn-diagrams", weight: 0.5 },
    { topic: "the-complement-of-an-event", weight: 0.3 },
  ],
  xp: 14,
  standards: ["CCSS.HSS.CP.A.1"],
  intro: t(
    `A prime on an event means "not": $A'$ is the event that $A$ does not happen. In a Venn diagram it is every region outside circle $A$, and that includes the region outside both circles, where people have neither property.

In a survey of $25$ people, $8$ are in $A$ only, $3$ in both, $10$ in $B$ only and $4$ in neither. The complement $A'$ is shaded:

{{figure 0}}

It holds $10 + 4 = 14$ people, so $P(A') = \\frac{14}{25}$. Circle $A$ holds the other $8 + 3 = 11$, and $\\frac{11}{25} + \\frac{14}{25} = 1$: an event and its complement always share out the whole diagram. In this lesson we shade complements of single and compound events, and events that mix complements with $\\cap$ and $\\cup$.`,
    `事件上的撇号表示“不”：$A'$ 是 $A$ 不发生的事件。在韦恩图中，它是圆 $A$ 之外的所有区域，其中包括两圆之外、两种属性都没有的区域。

在一次对 $25$ 人的调查中，仅 $A$ 有 $8$ 人，两者都有 $3$ 人，仅 $B$ 有 $10$ 人，两者都没有 $4$ 人。对立事件 $A'$ 画上了阴影：

{{figure 0}}

它有 $10 + 4 = 14$ 人，所以 $P(A') = \\frac{14}{25}$。圆 $A$ 中是另外 $8 + 3 = 11$ 人，$\\frac{11}{25} + \\frac{14}{25} = 1$：一个事件与它的对立事件总是正好分完整个图。这节课我们给单个事件和复合事件的对立事件画阴影，并处理对立事件与 $\\cap$、$\\cup$ 组合成的事件。`,
  ),
  introFigures: [complementsIntro],
  knowledgePoints: [
    {
      id: "complements-of-single-and-compound-events",
      title: t("Complements of events", "事件的对立事件"),
      explanation: t(
        `In a Venn diagram, the complement $A'$ is everything outside circle $A$, **including** the region outside both circles: a person there is not in $A$ either. The complement of a compound event is everything outside it: $(A \\cup B)'$ is the region outside both circles, and $(A \\cap B)'$ is everything except the overlap. Since an event and its complement share out the whole diagram, $P(E') = 1 - P(E)$ gives a second route to every answer.

With $12$ in $A$ only, $5$ in both, $18$ in $B$ only and $7$ outside both: $P(A') = \\frac{18 + 7}{42} = \\frac{25}{42}$, and indeed $1 - \\frac{17}{42} = \\frac{25}{42}$; $P((A \\cup B)') = \\frac{7}{42} = \\frac{1}{6}$.

> **Watch out.** $(A \\cap B)'$ is not $A' \\cap B'$. "Not both" keeps $A$ only, $B$ only and the outside, $\\frac{37}{42}$; "neither" keeps only the outside, $\\frac{7}{42}$.`,
        `在韦恩图中，对立事件 $A'$ 是圆 $A$ 之外的全部区域，**包括**两圆之外的区域：那里的人也不在 $A$ 中。复合事件的对立事件是它之外的一切：$(A \\cup B)'$ 是两圆之外的区域，$(A \\cap B)'$ 是除重叠部分以外的全部区域。一个事件与它的对立事件正好分完整个图，所以 $P(E') = 1 - P(E)$ 为每个答案提供了第二种算法。

仅 $A$ 有 $12$，两者都有 $5$，仅 $B$ 有 $18$，两者之外有 $7$：$P(A') = \\frac{18 + 7}{42} = \\frac{25}{42}$，确实 $1 - \\frac{17}{42} = \\frac{25}{42}$；$P((A \\cup B)') = \\frac{7}{42} = \\frac{1}{6}$。

> **注意。** $(A \\cap B)'$ 不是 $A' \\cap B'$。“不同时”保留仅 $A$、仅 $B$ 和圆外区域，为 $\\frac{37}{42}$；“两者都不”只保留圆外区域，为 $\\frac{7}{42}$。`,
      ),
      figure: venn2Figure([12, 5, 18, 7]),
      generate(rng) {
        const s = rng.pick(surveys);
        const c = venn2Counts(rng);
        const total = sum(c);
        const e = rng.pick(complementEvents.slice(0, 4));
        const n = vennCount(c, e.test);
        return {
          ...probProblem(
            t(`${surveyPrompt(s, total).en} Find $P(${e.tex})$.`, `${surveyPrompt(s, total)["zh-CN"]}求 $P(${e.tex})$。`),
            Q.of(n, total),
            vennSolution(c, e),
            [Q.of(total - n, total), Q.of(n - c[3], total), Q.of(c[0], total), Q.of(c[2], total)],
          ),
          figure: venn2Figure(c),
          solutionFigures: [venn2Figure(c, e)],
        };
      },
    },
    {
      id: "intersections-and-unions-with-complements",
      title: t("Intersections and unions with complements", "含对立事件的交与并"),
      explanation: t(
        `Read each part of the event as a set of regions, then combine them, region by region: $\\cap$ keeps the regions in **both** parts, $\\cup$ keeps the regions in **either**. Each of the four regions is either in the event or not, so checking them one at a time never misses a region.

- $A \\cap B'$: inside $A$ and outside $B$, the crescent of $A$.
- $A' \\cup B$: outside $A$, or inside $B$: every region except the crescent of $A$.

In the diagram above, $P(A \\cap B') = \\frac{12}{42} = \\frac{2}{7}$ and $P(A' \\cup B) = \\frac{5 + 18 + 7}{42} = \\frac{30}{42} = \\frac{5}{7}$. These two events are complements of each other, and $\\frac{12}{42} + \\frac{30}{42} = 1$.

> **Watch out.** A union with a complement reaches outside the circles: $A' \\cup B$ includes the $7$ people with neither property. Leaving that region out gives $\\frac{23}{42}$.`,
        `把事件的每一部分看作一组区域，再逐个区域地组合：$\\cap$ 保留**两部分都含**的区域，$\\cup$ 保留**任一部分含**的区域。四个区域中每一个要么在事件中，要么不在，逐个检查就不会漏掉区域。

- $A \\cap B'$：在 $A$ 内且在 $B$ 外，即 $A$ 的月牙形区域。
- $A' \\cup B$：在 $A$ 外或在 $B$ 内：除 $A$ 的月牙形区域外的所有区域。

在上图中，$P(A \\cap B') = \\frac{12}{42} = \\frac{2}{7}$，$P(A' \\cup B) = \\frac{5 + 18 + 7}{42} = \\frac{30}{42} = \\frac{5}{7}$。这两个事件互为对立事件，$\\frac{12}{42} + \\frac{30}{42} = 1$。

> **注意。** 与对立事件的并会延伸到圆外：$A' \\cup B$ 包括两种属性都没有的 $7$ 人。漏掉这个区域会得到 $\\frac{23}{42}$。`,
      ),
      generate(rng) {
        const s = rng.pick(surveys);
        const c = venn2Counts(rng);
        const total = sum(c);
        const e = rng.pick(complementEvents.slice(4));
        const n = vennCount(c, e.test);
        return {
          ...probProblem(
            t(`${surveyPrompt(s, total).en} Find $P(${e.tex})$.`, `${surveyPrompt(s, total)["zh-CN"]}求 $P(${e.tex})$。`),
            Q.of(n, total),
            vennSolution(c, e),
            [Q.of(total - n, total), Q.of(n - c[3], total), Q.of(c[0] + c[1], total), Q.of(c[1] + c[2], total)],
          ),
          figure: venn2Figure(c),
          solutionFigures: [venn2Figure(c, e)],
        };
      },
    },
  ],
};

/** Venn3Event is an event built from A, B and C. */
interface Venn3Event {
  readonly tex: string;
  readonly en: string;
  readonly zh: string;
  readonly test: (a: boolean, b: boolean, c: boolean) => boolean;
}

const venn3In = (e: Venn3Event) => (_: number, i: number) => e.test(venn3Members[i]![0], venn3Members[i]![1], venn3Members[i]![2]);

const venn3Count = (c: Venn3, e: Venn3Event) => sum(c.filter(venn3In(e)));

/**
 * venn3Solution writes the solution of an event's probability from a three-set Venn diagram: the event shaded (its figure 0),
 * its regions added and divided by the total of all eight regions, and the check that the unshaded regions make up the rest.
 */
function venn3Solution(c: Venn3, e: Venn3Event): Text {
  const inside = venn3In(e);
  const parts = c.filter(inside);
  const rest = c.filter((x, i) => !inside(x, i));
  const n = sum(parts);
  const total = sum(c);
  return t(
    `${stepLabel(1, "shade the event", "画出事件").en} The event is ${e.en}:

{{figure 0}}

${stepLabel(2, "count and divide", "计数并相除").en} The shaded regions hold $${plus(parts)}$ people. Every person is equally likely to be chosen, so divide by the total of all eight regions, $${total}$:${steps(`P = ${ratio(n, total)}`)}**Check.** The unshaded regions hold $${plus(rest)}$ people, and $${n} + ${sum(rest)} = ${total}$: the two parts make up the whole survey, so the answer and the probability of the rest add to $1$.`,
    `${stepLabel(1, "shade the event", "画出事件")["zh-CN"]}该事件是${e.zh}：

{{figure 0}}

${stepLabel(2, "count and divide", "计数并相除")["zh-CN"]}阴影区域共有 $${plus(parts)}$ 人。每个人被选中的可能性相同，所以除以八个区域的总人数 $${total}$：${steps(`P = ${ratio(n, total)}`)}**检验。** 没有阴影的区域有 $${plus(rest)}$ 人，$${n} + ${sum(rest)} = ${total}$：两部分合起来正好是全部调查对象，所以答案与其余部分的概率之和为 $1$。`,
  );
}

const venn3Intersections: readonly Venn3Event[] = [
  {
    tex: "P(A \\cap B \\cap C)",
    en: "the center region, common to all three circles",
    zh: "三圆共同的中心区域",
    test: (a, b, c) => a && b && c,
  },
  { tex: "P(A \\cap B)", en: "the overlap of $A$ and $B$, center included", zh: "$A$ 与 $B$ 的重叠部分（含中心）", test: (a, b) => a && b },
  {
    tex: "P(A \\cap C)",
    en: "the overlap of $A$ and $C$, center included",
    zh: "$A$ 与 $C$ 的重叠部分（含中心）",
    test: (a, _, c) => a && c,
  },
  {
    tex: "P(B \\cap C)",
    en: "the overlap of $B$ and $C$, center included",
    zh: "$B$ 与 $C$ 的重叠部分（含中心）",
    test: (_, b, c) => b && c,
  },
  { tex: "P(A)", en: "the whole circle $A$, four regions", zh: "整个圆 $A$（四个区域）", test: (a) => a },
  { tex: "P(C)", en: "the whole circle $C$, four regions", zh: "整个圆 $C$（四个区域）", test: (_, __, c) => c },
];

const venn3Unions: readonly Venn3Event[] = [
  {
    tex: "P(A \\cup B)",
    en: "everything inside $A$ or $B$, six regions",
    zh: "$A$ 或 $B$ 内的全部区域（六个区域）",
    test: (a, b) => a || b,
  },
  {
    tex: "P(B \\cup C)",
    en: "everything inside $B$ or $C$, six regions",
    zh: "$B$ 或 $C$ 内的全部区域（六个区域）",
    test: (_, b, c) => b || c,
  },
  {
    tex: "P(A \\cup C)",
    en: "everything inside $A$ or $C$, six regions",
    zh: "$A$ 或 $C$ 内的全部区域（六个区域）",
    test: (a, _, c) => a || c,
  },
  {
    tex: "P(A \\cup B \\cup C)",
    en: "everything inside at least one circle",
    zh: "至少在一个圆内的全部区域",
    test: (a, b, c) => a || b || c,
  },
  {
    tex: "P((A \\cup B) \\cap C)",
    en: "the part of $C$ that is also in $A$ or $B$",
    zh: "$C$ 中也在 $A$ 或 $B$ 内的部分",
    test: (a, b, c) => (a || b) && c,
  },
];

const venn3Others: readonly Venn3Event[] = [
  {
    tex: "P((A \\cup B \\cup C)')",
    en: "the region outside all three circles",
    zh: "三圆之外的区域",
    test: (a, b, c) => !a && !b && !c,
  },
  {
    tex: "P(\\text{exactly one})",
    en: "the three regions inside exactly one circle",
    zh: "恰好在一个圆内的三个区域",
    test: (a, b, c) => Number(a) + Number(b) + Number(c) === 1,
  },
  {
    tex: "P(A \\cap B \\cap C')",
    en: "the part of the overlap of $A$ and $B$ outside $C$",
    zh: "$A$ 与 $B$ 的重叠部分中在 $C$ 之外的部分",
    test: (a, b, c) => a && b && !c,
  },
  {
    tex: "P(A \\cap B' \\cap C')",
    en: "the part of $A$ outside both $B$ and $C$",
    zh: "$A$ 中在 $B$ 和 $C$ 之外的部分",
    test: (a, b, c) => a && !b && !c,
  },
  { tex: "P(C')", en: "everything outside circle $C$", zh: "圆 $C$ 之外的全部区域", test: (_, __, c) => !c },
];

/** venn3Problem asks for the probability of one event from a three-set Venn diagram. */
function venn3Problem(rng: Rng, events: readonly Venn3Event[]): Problem {
  const s = rng.pick(surveys3);
  const c = venn3Counts(rng);
  const total = sum(c);
  const e = rng.pick(events);
  const n = venn3Count(c, e);
  const what =
    e.tex === "P(\\text{exactly one})"
      ? t("What is the probability that exactly one of $A$, $B$ and $C$ happens?", "$A$、$B$、$C$ 恰好发生一个的概率是多少？")
      : t(`Find $${e.tex}$.`, `求 $${e.tex}$。`);
  const wrong = [Q.of(total - n, total), ...[0, 1, 2, 3, 4, 5, 6].map((i) => Q.of(n - c[i]!, total)), Q.of(n, total - c[7])];
  return {
    ...probProblem(
      t(`${survey3Prompt(s, total).en} ${what.en}`, `${survey3Prompt(s, total)["zh-CN"]}${what["zh-CN"]}`),
      Q.of(n, total),
      venn3Solution(c, e),
      wrong.filter((w) => w.sign() > 0),
    ),
    figure: venn3Figure(c),
    solutionFigures: [venn3Figure(c, e)],
  };
}

/** threeIntro draws a survey of 30 in three circles with the overlap of A and B shaded. */
const threeIntro: Figure = venn3Figure([6, 2, 7, 3, 1, 4, 5, 2], {
  en: "the overlap of A and B, center included",
  zh: "A 与 B 的重叠部分（含中心）",
  test: (a, b) => a && b,
});

/** computingProbabilitiesForThreeEventsUsingVennDiagrams is outline topic 6.17.6. */
export const computingProbabilitiesForThreeEventsUsingVennDiagrams: TopicDef = {
  id: "computing-probabilities-for-three-events-using-venn-diagrams",
  title: t("Computing Probabilities for Three Events Using Venn Diagrams", "用韦恩图求三个事件的概率"),
  summary: t(
    "Read the eight regions of a three-set Venn diagram to find probabilities of intersections, unions and complements.",
    "读出三集合韦恩图的八个区域，求交、并和对立事件的概率。",
  ),
  prerequisites: ["computing-probabilities-of-events-containing-complements-using-venn-diagrams"],
  encompasses: [{ topic: "computing-probabilities-of-events-containing-complements-using-venn-diagrams", weight: 0.4 }],
  xp: 14,
  standards: ["CCSS.HSS.CP.A.1"],
  intro: t(
    `With three events the Venn diagram has three circles, and they cut $U$ into **eight** regions: one for each way of being in or out of $A$, $B$ and $C$ ($2 \\times 2 \\times 2 = 8$). Every person sits in exactly one region, so the method is the same as with two events: shade the regions of the event, add, and divide by the total.

A survey of $30$ students asked about three clubs. The event "$A$ and $B$" is shaded; it covers **two** regions, the one in $A$ and $B$ but not $C$, and the center, in all three:

{{figure 0}}

So $P(A \\cap B) = \\frac{2 + 1}{30} = \\frac{3}{30} = \\frac{1}{10}$. The other six regions hold $6 + 7 + 3 + 4 + 5 + 2 = 27$, and $3 + 27 = 30$. In this lesson we find intersections, unions, complements and "exactly one" with three events.`,
    `有三个事件时，韦恩图有三个圆，它们把 $U$ 分成**八个**区域：对应在 $A$、$B$、$C$ 中或不在其中的每一种情况（$2 \\times 2 \\times 2 = 8$）。每个人恰好在一个区域中，所以方法与两个事件时相同：给事件的区域画阴影，相加，再除以总人数。

一次调查询问了 $30$ 名学生参加三个社团的情况。事件“$A$ 且 $B$”画上了阴影；它包括**两个**区域：在 $A$ 和 $B$ 中但不在 $C$ 中的区域，以及三者共有的中心：

{{figure 0}}

所以 $P(A \\cap B) = \\frac{2 + 1}{30} = \\frac{3}{30} = \\frac{1}{10}$。其余六个区域有 $6 + 7 + 3 + 4 + 5 + 2 = 27$ 人，$3 + 27 = 30$。这节课我们求三个事件的交、并、对立事件以及“恰好一个”的概率。`,
  ),
  introFigures: [threeIntro],
  knowledgePoints: [
    {
      id: "intersections-of-three-events",
      title: t("Intersections with three events", "三个事件的交"),
      explanation: t(
        `Three overlapping circles split $U$ into eight regions. The center belongs to all three circles; the three regions around it belong to exactly two. A person in the center is in $A$ and in $B$ too, so $A \\cap B$ is **two** regions: $A$ and $B$ but not $C$, plus the center. For the same reason the whole circle $A$ is four regions.

In the diagram, the total is $12 + 5 + 18 + 7 + 3 + 14 + 9 + 11 = 79$. So $P(A \\cap B \\cap C) = \\frac{3}{79}$, $P(A \\cap B) = \\frac{5 + 3}{79} = \\frac{8}{79}$ and $P(A) = \\frac{12 + 5 + 7 + 3}{79} = \\frac{27}{79}$.

> **Watch out.** $A \\cap B$ is not only the region marked between $A$ and $B$: the center is in both circles too. Leaving it out gives $\\frac{5}{79}$.`,
        `三个相交的圆把 $U$ 分成八个区域。中心区域属于三个圆；它周围的三个区域恰好属于两个圆。中心的人也在 $A$ 中、也在 $B$ 中，所以 $A \\cap B$ 由**两个**区域组成：在 $A$ 和 $B$ 中但不在 $C$ 中的区域，加上中心。同理，整个圆 $A$ 由四个区域组成。

在图中，总人数是 $12 + 5 + 18 + 7 + 3 + 14 + 9 + 11 = 79$。所以 $P(A \\cap B \\cap C) = \\frac{3}{79}$，$P(A \\cap B) = \\frac{5 + 3}{79} = \\frac{8}{79}$，$P(A) = \\frac{12 + 5 + 7 + 3}{79} = \\frac{27}{79}$。

> **注意。** $A \\cap B$ 不只是 $A$、$B$ 之间标出的那个区域：中心也同时在两个圆内。漏掉中心会得到 $\\frac{5}{79}$。`,
      ),
      figure: venn3Figure([12, 5, 18, 7, 3, 14, 9, 11]),
      generate: (rng) => venn3Problem(rng, venn3Intersections),
    },
    {
      id: "unions-of-three-events",
      figure: venn3Figure([12, 5, 18, 7, 3, 14, 9, 11]),
      title: t("Unions with three events", "三个事件的并"),
      explanation: t(
        `For a union, add every region inside at least one of the circles named, each region once. $A \\cup B$ covers six of the eight regions: all but $C$ only and the outside. $A \\cup B \\cup C$ is everything except the outside region, so it is quickest by the complement.

In the diagram above, $P(A \\cup B \\cup C) = \\frac{79 - 11}{79} = \\frac{68}{79}$. Adding the seven regions inside, $12 + 5 + 18 + 7 + 3 + 14 + 9 = 68$, gives the same count.

> **Watch out.** Adding whole circles counts the shared regions more than once: the center is in all three circles and would be counted three times. Add regions, each once.`,
        `求并集时，把至少在所列一个圆内的区域都加起来，每个区域只算一次。$A \\cup B$ 覆盖八个区域中的六个：除仅 $C$ 和外部区域之外的全部。$A \\cup B \\cup C$ 是除外部区域以外的全部，所以用对立事件算最快。

在上图中，$P(A \\cup B \\cup C) = \\frac{79 - 11}{79} = \\frac{68}{79}$。把圆内的七个区域相加 $12 + 5 + 18 + 7 + 3 + 14 + 9 = 68$，结果相同。

> **注意。** 把整个圆相加会把公共区域重复计算：中心在三个圆内，会被算三次。要按区域相加，每个区域只算一次。`,
      ),
      generate: (rng) => venn3Problem(rng, venn3Unions),
    },
    {
      id: "complements-and-exactly-one-with-three-events",
      figure: venn3Figure([12, 5, 18, 7, 3, 14, 9, 11]),
      title: t('Complements and "exactly one" with three events', "三个事件的对立事件与“恰好一个”"),
      explanation: t(
        `A prime excludes a circle: every region inside that circle is dropped. So $A \\cap B \\cap C'$ is the region in $A$ and $B$ but outside $C$, and $A \\cap B' \\cap C'$ is $A$ only. "Exactly one" is the three regions that belong to a single circle, and $(A \\cup B \\cup C)'$ is the region outside all three.

In the diagram of the first step, $P(\\text{exactly one}) = \\frac{12 + 18 + 9}{79} = \\frac{39}{79}$ and $P(A \\cap B \\cap C') = \\frac{5}{79}$.

> **Watch out.** "Exactly one" leaves out the regions in two circles **and** the center. And $C'$ includes the region outside all three circles, $11$ people, as well as the parts of $A$ and $B$ outside $C$.`,
        `撇号表示排除某个圆：该圆内的所有区域都去掉。所以 $A \\cap B \\cap C'$ 是在 $A$ 和 $B$ 中但在 $C$ 之外的区域；$A \\cap B' \\cap C'$ 是仅 $A$ 的区域。“恰好一个”是只属于一个圆的三个区域，$(A \\cup B \\cup C)'$ 是三圆之外的区域。

在第一步的图中，$P(\\text{恰好一个}) = \\frac{12 + 18 + 9}{79} = \\frac{39}{79}$，$P(A \\cap B \\cap C') = \\frac{5}{79}$。

> **注意。** “恰好一个”既要排除属于两个圆的区域，**也**要排除中心。$C'$ 除了 $A$、$B$ 在 $C$ 之外的部分，还包括三圆之外的 $11$ 人。`,
      ),
      generate: (rng) => venn3Problem(rng, venn3Others),
    },
  ],
};

/** Probs are P(A), P(B) and P(A ∩ B) in hundredths, drawn so that every probability is between 0 and 1. */
function probs(rng: Rng): [number, number, number] {
  for (;;) {
    const a = rng.int(10, 85);
    const b = rng.int(10, 85);
    const ab = rng.int(1, Math.min(a, b) - 1);
    if (a + b - ab < 100 && a + b - ab > Math.max(a, b)) return [a, b, ab];
  }
}

/** pd writes hundredths as a decimal: pd(35) is "0.35". */
const pd = (h: number) => dec(Q.of(h, 100));

const hundredths = (h: number) => Q.of(h, 100);

/** additionContexts name events A and B in words. */
const additionContexts: readonly (readonly [string, string, string, string, string, string])[] = [
  ["a randomly chosen student", "随机选的一名学生", "has a sister", "有姐妹", "has a brother", "有兄弟"],
  ["a randomly chosen household", "随机选的一户人家", "owns a cat", "养猫", "owns a dog", "养狗"],
  ["a randomly chosen day", "随机选的一天", "is windy", "刮风", "is rainy", "下雨"],
  ["a randomly chosen customer", "随机选的一名顾客", "buys milk", "买牛奶", "buys eggs", "买鸡蛋"],
  ["a randomly chosen employee", "随机选的一名员工", "speaks French", "会说法语", "speaks German", "会说德语"],
];

/** apart places two circles that do not overlap, for mutually exclusive events. */
const apart: Venn2Layout = {
  frame: box(-5.6, -3.4, 5.6, 3.4),
  circles: [
    { c: [-2.6, 0], r: 2.3 },
    { c: [2.6, 0], r: 2.3 },
  ],
  at: [
    [-2.6, 0],
    [0, 0],
    [2.6, 0],
    [4.7, -2.7],
  ],
};

/**
 * probVenn draws a two-set Venn diagram with probabilities written in the regions A only, both, B only and neither, and the
 * regions of shade shaded. With disjoint the circles are drawn apart and the overlap is left out.
 */
function probVenn(texts: readonly [string, string, string, string], shade?: Shading, disjoint = false): Figure {
  const layout = disjoint ? apart : overlapping;
  const marks = venn2Marks(layout, shade?.test);
  texts.forEach((s, i) => {
    if (!(disjoint && i === 1)) marks.push(count(layout.at[i]!, s));
  });
  const both = disjoint ? "" : `${texts[1]} in both, `;
  const bothZh = disjoint ? "" : `两者都有 ${texts[1]}，`;
  return {
    svg: sketch(marks),
    alt: t(
      `Venn diagram of A and B inside U${disjoint ? ", with circles that do not overlap" : ""}, with probabilities: ${texts[0]} in A only, ${both}${texts[2]} in B only, ${texts[3]} outside both.${shade ? ` Shaded: ${shade.en.replace(/\$/g, "")}.` : ""}`,
      `U 中 A 与 B 的韦恩图${disjoint ? "（两圆不相交）" : ""}，标出概率：仅 A 为 ${texts[0]}，${bothZh}仅 B 为 ${texts[2]}，两者之外为 ${texts[3]}。${shade ? `阴影部分：${shade.zh.replace(/\$/g, "")}。` : ""}`,
    ),
  };
}

/** regionProbs writes the probabilities of the regions A only, both, B only and neither from P(A), P(B) and P(A ∩ B) in hundredths. */
const regionProbs = (a: number, b: number, ab: number): [string, string, string, string] => [
  pd(a - ab),
  pd(ab),
  pd(b - ab),
  pd(100 - a - b + ab),
];

const unionShade: Shading = { en: "everything inside the circles", zh: "两圆内的全部区域", test: (a, b) => a || b };
const overlapShade: Shading = { en: "the overlap", zh: "重叠部分", test: (a, b) => a && b };
const outsideShade: Shading = { en: "the region outside both circles", zh: "两圆之外的区域", test: (a, b) => !a && !b };

/** additionIntro draws P(A) = 0.3, P(B) = 0.6 and P(A ∩ B) = 0.2 region by region, with the union shaded. */
const additionIntro: Figure = probVenn(["0.1", "0.2", "0.4", "0.3"], unionShade);

/** theAdditionLawOfProbability is outline topic 6.17.7. */
export const theAdditionLawOfProbability: TopicDef = {
  id: "the-addition-law-of-probability",
  title: t("The Addition Law of Probability", "概率的加法公式"),
  summary: t(
    "Use P(A ∪ B) = P(A) + P(B) − P(A ∩ B) to find any one of the four probabilities from the other three.",
    "利用 P(A ∪ B) = P(A) + P(B) − P(A ∩ B)，由其中三个概率求第四个。",
  ),
  prerequisites: ["computing-probabilities-for-compound-events-using-venn-diagrams", "decimal-arithmetic"],
  encompasses: [
    { topic: "computing-probabilities-for-compound-events-using-venn-diagrams", weight: 0.3 },
    { topic: "decimal-arithmetic", weight: 0.1 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.B.7"],
  intro: t(
    `Often we know probabilities rather than counts. A Venn diagram still works: write a probability in each region, and the four regions add to $1$.

On a randomly chosen day, the probability that it is windy ($A$) is $0.3$, that it is rainy ($B$) is $0.6$, and that it is both is $0.2$. The overlap gets $0.2$; the rest of circle $A$ gets $0.3 - 0.2 = 0.1$, the rest of circle $B$ gets $0.6 - 0.2 = 0.4$, and the outside gets what is left. The event "windy or rainy" is shaded:

{{figure 0}}

So $P(A \\cup B) = 0.1 + 0.2 + 0.4 = 0.7$. The same number comes straight from the three given probabilities: $0.3 + 0.6 - 0.2 = 0.7$, since adding the two circles counts the overlap twice. That shortcut is the **addition law**, and in this lesson we use it to find any one of the four probabilities from the other three.`,
    `我们知道的常常是概率而不是人数。韦恩图照样适用：在每个区域里写上概率，四个区域之和为 $1$。

随机选一天，刮风（$A$）的概率是 $0.3$，下雨（$B$）的概率是 $0.6$，既刮风又下雨的概率是 $0.2$。重叠部分是 $0.2$；圆 $A$ 的其余部分是 $0.3 - 0.2 = 0.1$，圆 $B$ 的其余部分是 $0.6 - 0.2 = 0.4$，圆外是剩下的部分。事件“刮风或下雨”画上了阴影：

{{figure 0}}

所以 $P(A \\cup B) = 0.1 + 0.2 + 0.4 = 0.7$。同一个数也可以直接由三个已知概率得到：$0.3 + 0.6 - 0.2 = 0.7$，因为把两个圆相加时重叠部分算了两次。这个捷径就是**加法公式**，这节课我们用它由其中三个概率求第四个。`,
  ),
  introFigures: [additionIntro],
  knowledgePoints: [
    {
      id: "finding-the-union",
      figure: geometryDrawings2["the-addition-law-of-probability#finding-the-union"],
      title: t("Finding P(A ∪ B)", "求 P(A ∪ B)"),
      explanation: t(
        `$P(A)$ covers circle $A$, which includes the overlap; $P(B)$ covers circle $B$, which includes it too. So adding $P(A)$ and $P(B)$ counts the overlap $A \\cap B$ twice. Subtract it once:

$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$

If $P(A) = 0.4$, $P(B) = 0.35$ and $P(A \\cap B) = 0.15$, then $P(A \\cup B) = 0.4 + 0.35 - 0.15 = 0.6$. Region by region: $A$ only is $0.25$, the overlap $0.15$, $B$ only $0.2$, and $0.25 + 0.15 + 0.2 = 0.6$.

> **Watch out.** Do not just add: $0.4 + 0.35 = 0.75$ counts the overlap twice. With larger probabilities the plain sum can even pass $1$, which no probability can.`,
        `$P(A)$ 覆盖圆 $A$，其中包括重叠部分；$P(B)$ 覆盖圆 $B$，也包括重叠部分。所以把 $P(A)$ 与 $P(B)$ 相加时，重叠部分 $A \\cap B$ 算了两次。减去一次：

$$P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$$

若 $P(A) = 0.4$，$P(B) = 0.35$，$P(A \\cap B) = 0.15$，则 $P(A \\cup B) = 0.4 + 0.35 - 0.15 = 0.6$。按区域算：仅 $A$ 为 $0.25$，重叠部分 $0.15$，仅 $B$ 为 $0.2$，$0.25 + 0.15 + 0.2 = 0.6$。

> **注意。** 不能直接相加：$0.4 + 0.35 = 0.75$ 把重叠部分算了两次。概率更大时，直接相加甚至会超过 $1$，而任何概率都不能超过 $1$。`,
      ),
      generate(rng) {
        const [a, b, ab] = probs(rng);
        const u = a + b - ab;
        const fractions = rng.bool(0.3);
        if (fractions) {
          const d = rng.pick([8, 10, 12, 15, 20]);
          const fa = rng.int(2, d - 2);
          const fb = rng.int(2, d - 2);
          const fab = rng.int(1, Math.min(fa, fb) - 1 || 1);
          const fu = fa + fb - fab;
          if (fab < Math.min(fa, fb) && fu <= d) {
            const [A, B, AB] = [Q.of(fa, d), Q.of(fb, d), Q.of(fab, d)];
            const U = Q.of(fu, d);
            const [onlyA, onlyB] = [A.sub(AB), B.sub(AB)];
            return {
              ...probProblem(
                t(
                  `For events $A$ and $B$, $P(A) = ${A.toLatex()}$, $P(B) = ${B.toLatex()}$ and $P(A \\cap B) = ${AB.toLatex()}$. Find $P(A \\cup B)$.`,
                  `事件 $A$、$B$ 满足 $P(A) = ${A.toLatex()}$，$P(B) = ${B.toLatex()}$，$P(A \\cap B) = ${AB.toLatex()}$。求 $P(A \\cup B)$。`,
                ),
                U,
                t(
                  `${stepLabel(1, "picture the regions", "画出区域").en} The overlap is $${AB.toLatex()}$, so $A$ only is $${A.toLatex()} - ${AB.toLatex()} = ${onlyA.toLatex()}$ and $B$ only is $${B.toLatex()} - ${AB.toLatex()} = ${onlyB.toLatex()}$. The union is everything inside the circles:

{{figure 0}}

${stepLabel(2, "use the addition law", "利用加法公式").en} Adding $P(A)$ and $P(B)$ counts the overlap twice, so subtract it once:${steps(`P(A \\cup B) = ${A.toLatex()} + ${B.toLatex()} - ${AB.toLatex()} = ${U.toLatex()}`)}**Check.** Add the three regions inside the circles: $${onlyA.toLatex()} + ${AB.toLatex()} + ${onlyB.toLatex()} = ${U.toLatex()}$, the same, and it lies between $0$ and $1$.`,
                  `${stepLabel(1, "picture the regions", "画出区域")["zh-CN"]}重叠部分是 $${AB.toLatex()}$，所以仅 $A$ 为 $${A.toLatex()} - ${AB.toLatex()} = ${onlyA.toLatex()}$，仅 $B$ 为 $${B.toLatex()} - ${AB.toLatex()} = ${onlyB.toLatex()}$。并集是两圆内的全部区域：

{{figure 0}}

${stepLabel(2, "use the addition law", "利用加法公式")["zh-CN"]}把 $P(A)$ 与 $P(B)$ 相加时重叠部分算了两次，所以减去一次：${steps(`P(A \\cup B) = ${A.toLatex()} + ${B.toLatex()} - ${AB.toLatex()} = ${U.toLatex()}`)}**检验。** 把圆内三个区域相加：$${onlyA.toLatex()} + ${AB.toLatex()} + ${onlyB.toLatex()} = ${U.toLatex()}$，结果相同，并且在 $0$ 与 $1$ 之间。`,
                ),
                [A.add(B), A.add(B).add(AB), A.mul(B)],
              ),
              solutionFigures: [probVenn([`${fa - fab}/${d}`, `${fab}/${d}`, `${fb - fab}/${d}`, `${d - fu}/${d}`], unionShade)],
            };
          }
        }
        const [who, whoZh, aEn, aZh, bEn, bZh] = rng.pick(additionContexts);
        const [ra, rab, rb] = regionProbs(a, b, ab);
        return {
          ...probProblem(
            t(
              `The probability that ${who} ${aEn} is $${pd(a)}$, that it ${bEn} is $${pd(b)}$, and that it ${aEn} and ${bEn} is $${pd(ab)}$. What is the probability that it ${aEn} or ${bEn}?`,
              `${whoZh}${aZh}的概率是 $${pd(a)}$，${bZh}的概率是 $${pd(b)}$，既${aZh}又${bZh}的概率是 $${pd(ab)}$。${aZh}或${bZh}的概率是多少？`,
            ),
            hundredths(u),
            t(
              `${stepLabel(1, "picture the regions", "画出区域").en} Let $A$ be "${aEn}" and $B$ "${bEn}". The overlap is $${pd(ab)}$, so $A$ only is $${pd(a)} - ${pd(ab)} = ${ra}$ and $B$ only is $${pd(b)} - ${pd(ab)} = ${rb}$. The union is everything inside the circles:

{{figure 0}}

${stepLabel(2, "use the addition law", "利用加法公式").en} Adding $P(A)$ and $P(B)$ counts the overlap twice, so subtract it once:${steps(`P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}`)}**Check.** Add the three regions inside the circles: $${ra} + ${rab} + ${rb} = ${pd(u)}$, the same, and it lies between $0$ and $1$.`,
              `${stepLabel(1, "picture the regions", "画出区域")["zh-CN"]}设 $A$ 为“${aZh}”，$B$ 为“${bZh}”。重叠部分是 $${pd(ab)}$，所以仅 $A$ 为 $${pd(a)} - ${pd(ab)} = ${ra}$，仅 $B$ 为 $${pd(b)} - ${pd(ab)} = ${rb}$。并集是两圆内的全部区域：

{{figure 0}}

${stepLabel(2, "use the addition law", "利用加法公式")["zh-CN"]}把 $P(A)$ 与 $P(B)$ 相加时重叠部分算了两次，所以减去一次：${steps(`P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}`)}**检验。** 把圆内三个区域相加：$${ra} + ${rab} + ${rb} = ${pd(u)}$，结果相同，并且在 $0$ 与 $1$ 之间。`,
            ),
            [hundredths(a + b), hundredths(a + b + ab), hundredths(u - ab)],
          ),
          solutionFigures: [probVenn(regionProbs(a, b, ab), unionShade)],
        };
      },
    },
    {
      id: "finding-the-intersection",
      title: t("Finding P(A ∩ B)", "求 P(A ∩ B)"),
      explanation: t(
        `The addition law links four probabilities, so any three give the fourth. $P(A) + P(B)$ counts the overlap twice and $P(A \\cup B)$ counts it once, so their difference is exactly the overlap:

$$P(A \\cap B) = P(A) + P(B) - P(A \\cup B)$$

If $P(A) = 0.5$, $P(B) = 0.45$ and $P(A \\cup B) = 0.7$, then $P(A \\cap B) = 0.5 + 0.45 - 0.7 = 0.25$. Substituting back, $0.5 + 0.45 - 0.25 = 0.7$.

> **Watch out.** In general $P(A \\cap B)$ is not $P(A) \\times P(B)$; that holds only for independent events. Here $0.5 \\times 0.45 = 0.225$, not $0.25$.`,
        `加法公式联系着四个概率，所以已知其中三个就能求出第四个。$P(A) + P(B)$ 把重叠部分算了两次，$P(A \\cup B)$ 只算一次，所以二者之差正好是重叠部分：

$$P(A \\cap B) = P(A) + P(B) - P(A \\cup B)$$

若 $P(A) = 0.5$，$P(B) = 0.45$，$P(A \\cup B) = 0.7$，则 $P(A \\cap B) = 0.5 + 0.45 - 0.7 = 0.25$。代回检验：$0.5 + 0.45 - 0.25 = 0.7$。

> **注意。** 一般来说 $P(A \\cap B)$ 不等于 $P(A) \\times P(B)$；只有独立事件才如此。这里 $0.5 \\times 0.45 = 0.225$，不是 $0.25$。`,
      ),
      generate(rng) {
        const [a, b, ab] = probs(rng);
        const u = a + b - ab;
        return {
          ...probProblem(
            t(
              `For events $A$ and $B$, $P(A) = ${pd(a)}$, $P(B) = ${pd(b)}$ and $P(A \\cup B) = ${pd(u)}$. Find $P(A \\cap B)$.`,
              `事件 $A$、$B$ 满足 $P(A) = ${pd(a)}$，$P(B) = ${pd(b)}$，$P(A \\cup B) = ${pd(u)}$。求 $P(A \\cap B)$。`,
            ),
            hundredths(ab),
            t(
              `${stepLabel(1, "rearrange the addition law", "变形加法公式").en} $P(A) + P(B) = ${pd(a)} + ${pd(b)} = ${pd(a + b)}$ counts the overlap twice, and $P(A \\cup B) = ${pd(u)}$ counts it once. The difference is the overlap:${steps(`P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}${stepLabel(2, "picture the regions", "画出区域").en} With the overlap known, every region can be filled in:

{{figure 0}}

**Check.** Substitute back into the addition law: $${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}$, as given. And $${pd(ab)}$ is no larger than $P(A)$ or $P(B)$, as an overlap must be.`,
              `${stepLabel(1, "rearrange the addition law", "变形加法公式")["zh-CN"]}$P(A) + P(B) = ${pd(a)} + ${pd(b)} = ${pd(a + b)}$ 把重叠部分算了两次，$P(A \\cup B) = ${pd(u)}$ 只算一次。二者之差就是重叠部分：${steps(`P(A \\cap B) = P(A) + P(B) - P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}${stepLabel(2, "picture the regions", "画出区域")["zh-CN"]}知道了重叠部分，每个区域都能填出来：

{{figure 0}}

**检验。** 代回加法公式：$${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}$，与已知一致。并且 $${pd(ab)}$ 不大于 $P(A)$ 和 $P(B)$，重叠部分理应如此。`,
            ),
            [hundredths(u - a), hundredths(u - b), hundredths(a + b + u), Q.of(a * b, 10000)],
          ),
          solutionFigures: [probVenn(regionProbs(a, b, ab), overlapShade)],
        };
      },
    },
    {
      id: "finding-one-event",
      title: t("Finding P(A) or P(B)", "求 P(A) 或 P(B)"),
      explanation: t(
        `To find one of the single events, rearrange for it:

$$P(B) = P(A \\cup B) - P(A) + P(A \\cap B)$$

The reason shows in the diagram: $P(A \\cup B) - P(A)$ removes all of circle $A$, overlap included, and leaves only $B$ only. Adding the overlap back gives the whole of circle $B$.

If $P(A \\cup B) = 0.8$, $P(A) = 0.5$ and $P(A \\cap B) = 0.2$, then $P(B) = 0.8 - 0.5 + 0.2 = 0.5$. Substituting back, $0.5 + 0.5 - 0.2 = 0.8$.

> **Watch out.** The intersection is **added** back, not subtracted: $0.8 - 0.5 - 0.2 = 0.1$ is only a part of circle $B$ with its overlap taken away twice.`,
        `求某个单独事件的概率时，对它变形：

$$P(B) = P(A \\cup B) - P(A) + P(A \\cap B)$$

原因可以从图中看出：$P(A \\cup B) - P(A)$ 去掉了整个圆 $A$（包括重叠部分），只剩下仅 $B$ 的部分。把重叠部分加回来，就得到整个圆 $B$。

若 $P(A \\cup B) = 0.8$，$P(A) = 0.5$，$P(A \\cap B) = 0.2$，则 $P(B) = 0.8 - 0.5 + 0.2 = 0.5$。代回检验：$0.5 + 0.5 - 0.2 = 0.8$。

> **注意。** 交集要**加**回来，而不是减去：$0.8 - 0.5 - 0.2 = 0.1$ 只是圆 $B$ 的一部分，重叠部分被减了两次。`,
      ),
      generate(rng) {
        const [a, b, ab] = probs(rng);
        const u = a + b - ab;
        const askA = rng.bool();
        const [known, want, kTex, wTex] = askA ? [b, a, "B", "A"] : [a, b, "A", "B"];
        const shade: Shading = askA ? { en: "circle A", zh: "圆 A", test: (x) => x } : { en: "circle B", zh: "圆 B", test: (_, y) => y };
        return {
          ...probProblem(
            t(
              `For events $A$ and $B$, $P(A \\cup B) = ${pd(u)}$, $P(${kTex}) = ${pd(known)}$ and $P(A \\cap B) = ${pd(ab)}$. Find $P(${wTex})$.`,
              `事件 $A$、$B$ 满足 $P(A \\cup B) = ${pd(u)}$，$P(${kTex}) = ${pd(known)}$，$P(A \\cap B) = ${pd(ab)}$。求 $P(${wTex})$。`,
            ),
            hundredths(want),
            t(
              `${stepLabel(1, `find ${wTex} only`, `求仅 ${wTex}`).en} Taking all of circle $${kTex}$ from the union leaves the part of $${wTex}$ outside the overlap: $${pd(u)} - ${pd(known)} = ${pd(u - known)}$.

${stepLabel(2, "add the overlap back", "加回重叠部分").en} Circle $${wTex}$ is that part together with the overlap, shaded:

{{figure 0}}
${steps(`P(${wTex}) = P(A \\cup B) - P(${kTex}) + P(A \\cap B) = ${pd(u)} - ${pd(known)} + ${pd(ab)} = ${pd(want)}`)}**Check.** Substitute back into the addition law: $${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}$, as given. And $${pd(want)}$ lies between $0$ and $1$.`,
              `${stepLabel(1, `find ${wTex} only`, `求仅 ${wTex}`)["zh-CN"]}从并集中去掉整个圆 $${kTex}$，剩下 $${wTex}$ 在重叠部分之外的部分：$${pd(u)} - ${pd(known)} = ${pd(u - known)}$。

${stepLabel(2, "add the overlap back", "加回重叠部分")["zh-CN"]}圆 $${wTex}$ 是这部分加上重叠部分（阴影）：

{{figure 0}}
${steps(`P(${wTex}) = P(A \\cup B) - P(${kTex}) + P(A \\cap B) = ${pd(u)} - ${pd(known)} + ${pd(ab)} = ${pd(want)}`)}**检验。** 代回加法公式：$${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}$，与已知一致。并且 $${pd(want)}$ 在 $0$ 与 $1$ 之间。`,
            ),
            [hundredths(u - known), hundredths(u - known - ab), hundredths(u + known - ab)].filter((w) => w.cmp(Q.one) <= 0),
          ),
          solutionFigures: [probVenn(regionProbs(a, b, ab), shade)],
        };
      },
    },
  ],
};

/** complementsLawIntro draws P(A) = 0.5, P(B) = 0.3 and P(A ∩ B) = 0.1 region by region, with the region of neither shaded. */
const complementsLawIntro: Figure = probVenn(["0.4", "0.1", "0.2", "0.3"], outsideShade);

/** applyingTheAdditionLawWithEventComplements is outline topic 6.17.8. */
export const applyingTheAdditionLawWithEventComplements: TopicDef = {
  id: "applying-the-addition-law-with-event-complements",
  title: t("Applying the Addition Law With Event Complements", "结合对立事件应用加法公式"),
  summary: t(
    "Combine the addition law with P(A') = 1 − P(A) to find the probability of neither event and to work from complements.",
    "把加法公式与 P(A') = 1 − P(A) 结合，求两事件都不发生的概率，并由对立事件求解。",
  ),
  prerequisites: ["the-addition-law-of-probability", "computing-probabilities-of-events-containing-complements-using-venn-diagrams"],
  encompasses: [
    { topic: "the-addition-law-of-probability", weight: 0.6 },
    { topic: "the-complement-of-an-event", weight: 0.3 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.B.7"],
  intro: t(
    `The addition law gives the inside of the circles, $P(A \\cup B)$. The region outside both circles is everything else, so its probability is $1 - P(A \\cup B)$. Complements and the addition law work together.

In a survey, the probability that a randomly chosen person has a bicycle ($A$) is $0.5$, a scooter ($B$) $0.3$, and both $0.1$. Then $P(A \\cup B) = 0.5 + 0.3 - 0.1 = 0.7$, and the person has neither with probability $1 - 0.7 = 0.3$, the shaded region:

{{figure 0}}

The four regions are $0.4$, $0.1$, $0.2$ and $0.3$, and they add to $1$. In this lesson we find the probability of neither event, and work back from probabilities given as complements.`,
    `加法公式给出两圆内部的概率 $P(A \\cup B)$。两圆之外的区域是其余的一切，所以它的概率是 $1 - P(A \\cup B)$。对立事件和加法公式可以一起使用。

在一次调查中，随机选一人，有自行车（$A$）的概率是 $0.5$，有滑板车（$B$）的概率是 $0.3$，两者都有的概率是 $0.1$。于是 $P(A \\cup B) = 0.5 + 0.3 - 0.1 = 0.7$，此人两者都没有的概率是 $1 - 0.7 = 0.3$，即阴影区域：

{{figure 0}}

四个区域分别是 $0.4$、$0.1$、$0.2$ 和 $0.3$，它们之和为 $1$。这节课我们求两事件都不发生的概率，并由以对立事件形式给出的概率倒推求解。`,
  ),
  introFigures: [complementsLawIntro],
  knowledgePoints: [
    {
      id: "probability-of-neither",
      title: t("The probability of neither event", "两事件都不发生的概率"),
      explanation: t(
        `"Neither $A$ nor $B$" is the region outside both circles. Everything else is inside at least one circle, which is "$A$ or $B$", so neither is its complement, $(A \\cup B)'$. Find $P(A \\cup B)$ with the addition law, then subtract from $1$:

$$P(\\text{neither}) = 1 - \\big(P(A) + P(B) - P(A \\cap B)\\big)$$

With $P(A) = 0.4$, $P(B) = 0.35$ and $P(A \\cap B) = 0.15$: $P(A \\cup B) = 0.6$, so $P(\\text{neither}) = 0.4$. The regions $0.25$, $0.15$, $0.2$ and $0.4$ add to $1$.

> **Watch out.** $1 - P(A) - P(B) = 0.25$ takes the overlap away twice. And $1 - P(A \\cap B)$ is "not both", which still includes $A$ only and $B$ only.`,
        `“$A$ 和 $B$ 都不发生”是两圆之外的区域。其余部分都至少在一个圆内，即“$A$ 或 $B$”，所以“都不发生”是它的对立事件 $(A \\cup B)'$。先用加法公式求 $P(A \\cup B)$，再用 $1$ 减去它：

$$P(\\text{都不发生}) = 1 - \\big(P(A) + P(B) - P(A \\cap B)\\big)$$

若 $P(A) = 0.4$，$P(B) = 0.35$，$P(A \\cap B) = 0.15$：$P(A \\cup B) = 0.6$，所以 $P(\\text{都不发生}) = 0.4$。四个区域 $0.25$、$0.15$、$0.2$、$0.4$ 之和为 $1$。

> **注意。** $1 - P(A) - P(B) = 0.25$ 把重叠部分减了两次。$1 - P(A \\cap B)$ 是“不同时发生”，其中仍包括仅 $A$ 和仅 $B$。`,
      ),
      generate(rng) {
        const [a, b, ab] = probs(rng);
        const u = a + b - ab;
        const [who, whoZh, aEn, aZh, bEn, bZh] = rng.pick(additionContexts);
        const [ra, rab, rb, rn] = regionProbs(a, b, ab);
        return {
          ...probProblem(
            t(
              `The probability that ${who} ${aEn} is $${pd(a)}$, that it ${bEn} is $${pd(b)}$, and that it ${aEn} and ${bEn} is $${pd(ab)}$. What is the probability that it does neither?`,
              `${whoZh}${aZh}的概率是 $${pd(a)}$，${bZh}的概率是 $${pd(b)}$，既${aZh}又${bZh}的概率是 $${pd(ab)}$。两者都不的概率是多少？`,
            ),
            hundredths(100 - u),
            t(
              `${stepLabel(1, "find the union", "求并集").en} Let $A$ be "${aEn}" and $B$ "${bEn}". By the addition law, $P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}$.

${stepLabel(2, "take the complement", "取对立事件").en} "Neither" is the region outside both circles, shaded, which is everything not in the union:

{{figure 0}}
${steps(`P((A \\cup B)') = 1 - ${pd(u)} = ${pd(100 - u)}`)}**Check.** Fill in every region: $A$ only $${ra}$, both $${rab}$, $B$ only $${rb}$, neither $${rn}$. They add to $1$, and each lies between $0$ and $1$.`,
              `${stepLabel(1, "find the union", "求并集")["zh-CN"]}设 $A$ 为“${aZh}”，$B$ 为“${bZh}”。由加法公式，$P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}$。

${stepLabel(2, "take the complement", "取对立事件")["zh-CN"]}“都不”是两圆之外的区域（阴影），也就是并集之外的一切：

{{figure 0}}
${steps(`P((A \\cup B)') = 1 - ${pd(u)} = ${pd(100 - u)}`)}**检验。** 填出每个区域：仅 $A$ 为 $${ra}$，两者都有 $${rab}$，仅 $B$ 为 $${rb}$，都不为 $${rn}$。它们之和为 $1$，且每个都在 $0$ 与 $1$ 之间。`,
            ),
            [hundredths(u), hundredths(100 - a - b), hundredths(100 - ab), hundredths(100 - a - b - ab)],
          ),
          solutionFigures: [probVenn(regionProbs(a, b, ab), outsideShade)],
        };
      },
    },
    {
      id: "working-from-complements",
      title: t("Working from complements", "由对立事件求解"),
      explanation: t(
        `When some probabilities are given as complements, first convert them with $P(A) = 1 - P(A')$: an event and its complement share out the whole diagram. Then apply the addition law to the plain events.

If $P(A') = 0.7$, $P(B) = 0.45$ and $P(A \\cup B) = 0.6$: $P(A) = 0.3$, so $P(A \\cap B) = 0.3 + 0.45 - 0.6 = 0.15$. Substituting back, $0.3 + 0.45 - 0.15 = 0.6$.

> **Watch out.** Convert before you substitute. Putting $P(A') = 0.7$ straight into the addition law, $0.7 + 0.45 - 0.6 = 0.55$, finds nothing meaningful.`,
        `若某些概率以对立事件的形式给出，先用 $P(A) = 1 - P(A')$ 换算：一个事件与它的对立事件正好分完整个图。然后对原事件应用加法公式。

若 $P(A') = 0.7$，$P(B) = 0.45$，$P(A \\cup B) = 0.6$：$P(A) = 0.3$，所以 $P(A \\cap B) = 0.3 + 0.45 - 0.6 = 0.15$。代回检验：$0.3 + 0.45 - 0.15 = 0.6$。

> **注意。** 先换算，再代入。把 $P(A') = 0.7$ 直接代入加法公式，$0.7 + 0.45 - 0.6 = 0.55$，算出的数没有意义。`,
      ),
      generate(rng) {
        const [a, b, ab] = probs(rng);
        const u = a + b - ab;
        const kind = rng.int(0, 2);
        const check = t(
          `**Check.** Substitute back into the addition law: $${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}$. The four regions, $${regionProbs(a, b, ab).join(", ")}$, all lie between $0$ and $1$ and add to $1$.`,
          `**检验。** 代回加法公式：$${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}$。四个区域 $${regionProbs(a, b, ab).join("$、$")}$ 都在 $0$ 与 $1$ 之间，且和为 $1$。`,
        );
        const S1 = stepLabel(1, "convert the complements", "换算对立事件");
        const S2 = stepLabel(2, "use the addition law", "利用加法公式");
        if (kind === 0) {
          return {
            ...probProblem(
              t(
                `For events $A$ and $B$, $P(A') = ${pd(100 - a)}$, $P(B') = ${pd(100 - b)}$ and $P(A \\cap B) = ${pd(ab)}$. Find $P(A \\cup B)$.`,
                `事件 $A$、$B$ 满足 $P(A') = ${pd(100 - a)}$，$P(B') = ${pd(100 - b)}$，$P(A \\cap B) = ${pd(ab)}$。求 $P(A \\cup B)$。`,
              ),
              hundredths(u),
              t(
                `${S1.en} $P(A) = 1 - ${pd(100 - a)} = ${pd(a)}$ and $P(B) = 1 - ${pd(100 - b)} = ${pd(b)}$.

${S2.en} The union is everything inside the circles:

{{figure 0}}
${steps(`P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}`)}${check.en}`,
                `${S1["zh-CN"]}$P(A) = 1 - ${pd(100 - a)} = ${pd(a)}$，$P(B) = 1 - ${pd(100 - b)} = ${pd(b)}$。

${S2["zh-CN"]}并集是两圆内的全部区域：

{{figure 0}}
${steps(`P(A \\cup B) = ${pd(a)} + ${pd(b)} - ${pd(ab)} = ${pd(u)}`)}${check["zh-CN"]}`,
              ),
              [hundredths(200 - a - b - ab), hundredths(100 - u), hundredths(a + b)].filter((w) => w.cmp(Q.one) <= 0),
            ),
            solutionFigures: [probVenn(regionProbs(a, b, ab), unionShade)],
          };
        }
        if (kind === 1) {
          return {
            ...probProblem(
              t(
                `For events $A$ and $B$, $P(A') = ${pd(100 - a)}$, $P(B) = ${pd(b)}$ and $P(A \\cup B) = ${pd(u)}$. Find $P(A \\cap B)$.`,
                `事件 $A$、$B$ 满足 $P(A') = ${pd(100 - a)}$，$P(B) = ${pd(b)}$，$P(A \\cup B) = ${pd(u)}$。求 $P(A \\cap B)$。`,
              ),
              hundredths(ab),
              t(
                `${S1.en} $P(A) = 1 - ${pd(100 - a)} = ${pd(a)}$.

${S2.en} Rearranged for the overlap, shaded:

{{figure 0}}
${steps(`P(A \\cap B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}${check.en}`,
                `${S1["zh-CN"]}$P(A) = 1 - ${pd(100 - a)} = ${pd(a)}$。

${S2["zh-CN"]}变形求重叠部分（阴影）：

{{figure 0}}
${steps(`P(A \\cap B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}${check["zh-CN"]}`,
              ),
              [hundredths(100 - a + b - u), hundredths(u - b), hundredths(100 - ab)].filter((w) => w.sign() > 0 && w.cmp(Q.one) <= 0),
            ),
            solutionFigures: [probVenn(regionProbs(a, b, ab), overlapShade)],
          };
        }
        return {
          ...probProblem(
            t(
              `For events $A$ and $B$, $P(A) = ${pd(a)}$, $P(B) = ${pd(b)}$ and $P((A \\cup B)') = ${pd(100 - u)}$. Find $P(A \\cap B)$.`,
              `事件 $A$、$B$ 满足 $P(A) = ${pd(a)}$，$P(B) = ${pd(b)}$，$P((A \\cup B)') = ${pd(100 - u)}$。求 $P(A \\cap B)$。`,
            ),
            hundredths(ab),
            t(
              `${S1.en} The region outside both circles has probability $${pd(100 - u)}$, so the inside has $P(A \\cup B) = 1 - ${pd(100 - u)} = ${pd(u)}$.

${S2.en} Rearranged for the overlap, shaded:

{{figure 0}}
${steps(`P(A \\cap B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}${check.en}`,
              `${S1["zh-CN"]}两圆之外区域的概率是 $${pd(100 - u)}$，所以圆内的概率 $P(A \\cup B) = 1 - ${pd(100 - u)} = ${pd(u)}$。

${S2["zh-CN"]}变形求重叠部分（阴影）：

{{figure 0}}
${steps(`P(A \\cap B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}${check["zh-CN"]}`,
            ),
            [hundredths(a + b - 100 + u), hundredths(100 - u), hundredths(a + b + u - 100)].filter(
              (w) => w.sign() > 0 && w.cmp(Q.one) <= 0,
            ),
          ),
          solutionFigures: [probVenn(regionProbs(a, b, ab), overlapShade)],
        };
      },
    },
  ],
};

/** shareBar draws the probabilities of two mutually exclusive events side by side on a bar from 0 to 1, the rest unshaded. */
function shareBar(a: number, b: number): string {
  const xa = a / 10;
  const xb = (a + b) / 10;
  return sketch([
    { kind: "shade", points: box(0, 0, xb, 0.8) },
    { kind: "polygon", points: box(0, 0, 10, 0.8) },
    { kind: "segment", a: [xa, 0], b: [xa, 0.8] },
    { kind: "segment", a: [xb, 0], b: [xb, 0.8] },
    { kind: "label", at: [xa / 2, 0.8], text: pd(a), dir: "n" },
    { kind: "label", at: [(xa + xb) / 2, 0], text: pd(b), dir: "s" },
    { kind: "label", at: [(xb + 10) / 2, 0.8], text: pd(100 - a - b), dir: "n" },
    { kind: "label", at: [0, 0.4], text: "0", dir: "w" },
    { kind: "label", at: [10, 0.4], text: "1", dir: "e" },
  ]);
}

/** exclusiveIntro draws the multiples of 4 and the odd numbers from 1 to 10 in two circles apart, both shaded. */
const exclusiveIntro: Figure = {
  svg: venn2Elements([[4, 8], [], [1, 3, 5, 7, 9], [2, 6, 10]], (a, b) => a || b),
  alt: t(
    "Two circles that do not overlap inside U = {1, ..., 10}: A = {4, 8} and B = {1, 3, 5, 7, 9}, both shaded; 2, 6 and 10 lie outside.",
    "U = {1, ..., 10} 中两个不相交的圆：A = {4, 8}，B = {1, 3, 5, 7, 9}，两者都画了阴影；2、6、10 在圆外。",
  ),
};

/** mutuallyExclusiveEvents is outline topic 6.17.9. */
export const mutuallyExclusiveEvents: TopicDef = {
  id: "mutually-exclusive-events",
  title: t("Mutually Exclusive Events", "互斥事件"),
  summary: t(
    "Recognize mutually exclusive events and use P(A ∪ B) = P(A) + P(B) for them.",
    "识别互斥事件，并对其使用 P(A ∪ B) = P(A) + P(B)。",
  ),
  prerequisites: ["applying-the-addition-law-with-event-complements"],
  encompasses: [
    { topic: "the-addition-law-of-probability", weight: 0.4 },
    { topic: "the-intersection-of-sets", weight: 0.2 },
  ],
  xp: 12,
  standards: ["CCSS.HSS.CP.B.7"],
  intro: t(
    `Some events can never happen together. A card is drawn from ten cards numbered $1$ to $10$. Let $A$ be "a multiple of $4$", $\\{4, 8\\}$, and $B$ "odd", $\\{1, 3, 5, 7, 9\\}$. No number is both, so the circles of $A$ and $B$ do not overlap:

{{figure 0}}

With no overlap, nothing is counted twice when we add: $P(A \\cup B) = \\frac{2}{10} + \\frac{5}{10} = \\frac{7}{10}$, and the shaded numbers are indeed $7$ of the $10$. Events like these are called **mutually exclusive**. In this lesson we recognize them, add their probabilities, and test for them with the addition law.`,
    `有些事件永远不会同时发生。从编号 $1$ 到 $10$ 的十张卡片中抽一张。设 $A$ 为“$4$ 的倍数”$\\{4, 8\\}$，$B$ 为“奇数”$\\{1, 3, 5, 7, 9\\}$。没有一个数同时属于两者，所以 $A$ 与 $B$ 的圆不相交：

{{figure 0}}

没有重叠，相加时就不会重复计算：$P(A \\cup B) = \\frac{2}{10} + \\frac{5}{10} = \\frac{7}{10}$，阴影中的数确实是 $10$ 个中的 $7$ 个。这样的事件称为**互斥**事件。这节课我们识别互斥事件，把它们的概率相加，并用加法公式检验互斥。`,
  ),
  introFigures: [exclusiveIntro],
  knowledgePoints: [
    {
      id: "recognizing-mutually-exclusive-events",
      figure: geometryDrawings2["mutually-exclusive-events#recognizing-mutually-exclusive-events"],
      title: t("Recognizing mutually exclusive events", "识别互斥事件"),
      explanation: t(
        `Events $A$ and $B$ are **mutually exclusive** when they cannot happen together. An experiment has one outcome, so they can happen together exactly when some outcome belongs to both. So list both events and look for a shared outcome: mutually exclusive means $A \\cap B = \\varnothing$, and in a Venn diagram their circles do not overlap.

Drawing a card numbered $1$ to $10$: "even" and "less than $2$" are mutually exclusive, since $\\{2, 4, 6, 8, 10\\} \\cap \\{1\\} = \\varnothing$. "Even" and "a multiple of $3$" are not: both contain $6$.

> **Watch out.** Mutually exclusive events need not cover every outcome: $3$, $5$, $7$ and $9$ are in neither "even" nor "less than $2$". And different descriptions do not make events exclusive; only an empty intersection does.`,
        `如果事件 $A$ 与 $B$ 不能同时发生，就称它们**互斥**。一次试验只有一个结果，所以两事件能同时发生，当且仅当有某个结果同时属于两者。因此要列出两个事件，找公共结果：互斥就是 $A \\cap B = \\varnothing$，在韦恩图中它们的圆不相交。

从编号 $1$ 到 $10$ 的卡片中抽一张：“偶数”与“小于 $2$”互斥，因为 $\\{2, 4, 6, 8, 10\\} \\cap \\{1\\} = \\varnothing$。“偶数”与“$3$ 的倍数”不互斥：两者都含 $6$。

> **注意。** 互斥事件不必包含所有结果：$3$、$5$、$7$、$9$ 既不是偶数也不小于 $2$。描述不同也不代表互斥；只有交集为空才互斥。`,
      ),
      generate(rng) {
        const n = rng.pick([6, 8, 10, 12, 15, 20]);
        const s = range(1, n);
        const want = rng.bool();
        for (;;) {
          const e1 = numberEvent(rng, n);
          const e2 = numberEvent(rng, n);
          const a = s.filter(e1.test);
          const b = s.filter(e2.test);
          if (a.length === 0 || b.length === 0 || e1.en === e2.en) continue;
          const common = intersection(a, b);
          if ((common.length === 0) !== want) continue;
          const what =
            n === 6
              ? t("A six-sided die is rolled", "掷一枚六面骰子")
              : t(`A card is drawn from ${n} cards numbered 1 to ${n}`, `从编号 1 到 ${n} 的 ${n} 张卡片中抽一张`);
          const u = union(a, b);
          const S1 = stepLabel(1, "list the events", "列出事件");
          const S2 = stepLabel(2, "look for a shared outcome", "寻找公共结果");
          const shade = want ? (x: boolean, y: boolean) => x || y : (x: boolean, y: boolean) => x && y;
          return {
            ...choiceProblem({
              prompt: t(
                `${what.en}. Let $A$ be the event that the number is ${e1.en}, and $B$ the event that it is ${e2.en}. Are $A$ and $B$ mutually exclusive?`,
                `${what["zh-CN"]}。事件 $A$ 表示这个数${e1.zh}，事件 $B$ 表示这个数${e2.zh}。$A$ 与 $B$ 互斥吗？`,
              ),
              options: yesNo,
              correct: want ? 0 : 1,
              solution: want
                ? t(
                    `${S1.en} $A = ${setTex(a)}$ and $B = ${setTex(b)}$.

${S2.en} No number is in both lists, so $A \\cap B = \\varnothing$ and the circles do not overlap:

{{figure 0}}

The events cannot happen together: they are mutually exclusive.

**Check.** Count the union a second way: $A \\cup B = ${setTex(u)}$ has $${u.length}$ outcomes, and $n(A) + n(B) = ${a.length} + ${b.length} = ${a.length + b.length}$, the same, because nothing is counted twice.`,
                    `${S1["zh-CN"]}$A = ${setTex(a)}$，$B = ${setTex(b)}$。

${S2["zh-CN"]}没有一个数同时在两个列表中，所以 $A \\cap B = \\varnothing$，两圆不相交：

{{figure 0}}

两个事件不能同时发生：它们互斥。

**检验。** 换一种方法数并集：$A \\cup B = ${setTex(u)}$ 有 $${u.length}$ 个结果，而 $n(A) + n(B) = ${a.length} + ${b.length} = ${a.length + b.length}$，两者相同，因为没有重复计算。`,
                  )
                : t(
                    `${S1.en} $A = ${setTex(a)}$ and $B = ${setTex(b)}$.

${S2.en} Both lists contain $${common.join(", ")}$, so $A \\cap B = ${setTex(common)}$, the shaded overlap:

{{figure 0}}

If the number is ${common.length === 1 ? `$${common[0]}$` : `any of $${common.join(", ")}$`}, both events happen at once: they are not mutually exclusive.

**Check.** Count the union a second way: $A \\cup B = ${setTex(u)}$ has $${u.length}$ outcomes, but $n(A) + n(B) = ${a.length} + ${b.length} = ${a.length + b.length}$, which counts the $${common.length}$ shared ${common.length === 1 ? "outcome" : "outcomes"} twice.`,
                    `${S1["zh-CN"]}$A = ${setTex(a)}$，$B = ${setTex(b)}$。

${S2["zh-CN"]}两个列表都含有 $${common.join(", ")}$，所以 $A \\cap B = ${setTex(common)}$，即阴影的重叠部分：

{{figure 0}}

如果这个数是 $${common.join(", ")}$${common.length === 1 ? "" : "中的任一个"}，两个事件就同时发生：它们不互斥。

**检验。** 换一种方法数并集：$A \\cup B = ${setTex(u)}$ 有 $${u.length}$ 个结果，而 $n(A) + n(B) = ${a.length} + ${b.length} = ${a.length + b.length}$，把 $${common.length}$ 个公共结果算了两次。`,
                  ),
            }),
            solutionFigures: [
              {
                svg: venn2Elements(regionsOf(s, a, b), shade),
                alt: t(
                  `Venn diagram of A = ${setTex(a).replace(/\\/g, "")} and B = ${setTex(b).replace(/\\/g, "")}${want ? ", circles apart, both shaded" : `, overlap ${setTex(common).replace(/\\/g, "")} shaded`}.`,
                  `A = ${setTex(a).replace(/\\/g, "")} 与 B = ${setTex(b).replace(/\\/g, "")} 的韦恩图${want ? "，两圆不相交，都画了阴影" : `，重叠部分 ${setTex(common).replace(/\\/g, "")} 画了阴影`}。`,
                ),
              },
            ],
          };
        }
      },
    },
    {
      id: "adding-probabilities-of-mutually-exclusive-events",
      title: t("Adding probabilities of mutually exclusive events", "互斥事件的概率相加"),
      explanation: t(
        `For mutually exclusive events there is no overlap, so $P(A \\cap B) = 0$ and nothing is counted twice. The addition law becomes

$$P(A \\cup B) = P(A) + P(B)$$

A spinner lands on red with probability $0.25$ and on blue with probability $0.4$. It cannot land on both, so $P(\\text{red or blue}) = 0.65$ and $P(\\text{neither}) = 1 - 0.65 = 0.35$. The three parts $0.25 + 0.4 + 0.35$ make $1$.

> **Watch out.** Add probabilities only when the events cannot happen together. For events that overlap, the plain sum counts the overlap twice; that is why $P(A) + P(B)$ can come out above $1$.`,
        `对互斥事件，没有重叠部分，所以 $P(A \\cap B) = 0$，不会重复计算。加法公式变为

$$P(A \\cup B) = P(A) + P(B)$$

转盘停在红色的概率是 $0.25$，停在蓝色的概率是 $0.4$。它不能同时停在两种颜色上，所以 $P(\\text{红或蓝}) = 0.65$，$P(\\text{都不是}) = 1 - 0.65 = 0.35$。三部分 $0.25 + 0.4 + 0.35$ 合起来为 $1$。

> **注意。** 只有事件不能同时发生时，概率才能直接相加。对有重叠的事件，直接相加会把重叠部分算两次；所以 $P(A) + P(B)$ 才可能超过 $1$。`,
      ),
      generate(rng) {
        const a = rng.int(5, 60);
        const b = rng.int(5, 90 - a);
        const [c1, c2] = rng.sample(colors, 2);
        const neither = rng.bool(0.4);
        const answer = neither ? 100 - a - b : a + b;
        const bar = shareBar(a, b);
        const S1 = stepLabel(1, "check that the events exclude each other", "确认两事件互斥");
        const S2 = stepLabel(2, "add", "相加");
        const S3 = stepLabel(3, "take the complement", "取对立事件");
        return {
          ...probProblem(
            t(
              `A spinner lands on ${c1![0]} with probability $${pd(a)}$ and on ${c2![0]} with probability $${pd(b)}$. ${neither ? `What is the probability that it lands on neither ${c1![0]} nor ${c2![0]}?` : `What is the probability that it lands on ${c1![0]} or ${c2![0]}?`}`,
              `转盘停在${c1![1]}色的概率是 $${pd(a)}$，停在${c2![1]}色的概率是 $${pd(b)}$。${neither ? `既不停在${c1![1]}色也不停在${c2![1]}色的概率是多少？` : `停在${c1![1]}色或${c2![1]}色的概率是多少？`}`,
            ),
            hundredths(answer),
            t(
              `${S1.en} The spinner cannot land on two colors at once, so the events are mutually exclusive: their probabilities sit side by side on the scale from $0$ to $1$, with no overlap:

{{figure 0}}

${S2.en} With nothing counted twice, add:${steps(`P(\\text{${c1![0]} or ${c2![0]}}) = ${pd(a)} + ${pd(b)} = ${pd(a + b)}`)}${neither ? `${S3.en} "Neither" is the unshaded rest of the bar:${steps(`P(\\text{neither}) = 1 - ${pd(a + b)} = ${pd(answer)}`)}` : ""}**Check.** The three parts of the bar add to $1$: $${pd(a)} + ${pd(b)} + ${pd(100 - a - b)} = 1$, and the answer lies between $0$ and $1$.`,
              `${S1["zh-CN"]}转盘不能同时停在两种颜色上，所以这两个事件互斥：它们的概率在 $0$ 到 $1$ 的刻度上并排放置，互不重叠：

{{figure 0}}

${S2["zh-CN"]}没有重复计算，直接相加：${steps(`P = ${pd(a)} + ${pd(b)} = ${pd(a + b)}`)}${neither ? `${S3["zh-CN"]}“都不”是条形中没有阴影的其余部分：${steps(`P = 1 - ${pd(a + b)} = ${pd(answer)}`)}` : ""}**检验。** 条形的三部分之和为 $1$：$${pd(a)} + ${pd(b)} + ${pd(100 - a - b)} = 1$，答案在 $0$ 与 $1$ 之间。`,
            ),
            [Q.of(a * b, 10000), hundredths(neither ? a + b : 100 - a - b), hundredths(Math.abs(a - b))],
          ),
          solutionFigures: [
            {
              svg: bar,
              alt: t(
                `A bar from 0 to 1 split into ${pd(a)} for ${c1![0]}, ${pd(b)} for ${c2![0]}, both shaded, and ${pd(100 - a - b)} for the rest.`,
                `从 0 到 1 的条形分成三段：${c1![1]}色 ${pd(a)}，${c2![1]}色 ${pd(b)}（都画了阴影），其余 ${pd(100 - a - b)}。`,
              ),
            },
          ],
        };
      },
    },
    {
      id: "testing-for-mutual-exclusivity",
      title: t("Testing with probabilities", "用概率检验互斥"),
      explanation: t(
        `Events are mutually exclusive exactly when the overlap is empty, $P(A \\cap B) = 0$. We rarely see the overlap directly, but the addition law finds it from the other three probabilities, so mutually exclusive means $P(A \\cup B) = P(A) + P(B)$.

If $P(A) = 0.3$, $P(B) = 0.5$ and $P(A \\cup B) = 0.8$, then $P(A \\cap B) = 0.3 + 0.5 - 0.8 = 0$: mutually exclusive. If instead $P(A \\cup B) = 0.7$, then $P(A \\cap B) = 0.1$: not mutually exclusive.

> **Watch out.** Any positive overlap, however small, means the events can happen together. And mutually exclusive is not the same as independent: independence is about $P(A \\cap B) = P(A) \\times P(B)$.`,
        `事件互斥当且仅当重叠部分为空，即 $P(A \\cap B) = 0$。我们很少能直接看到重叠部分，但加法公式能由另外三个概率求出它，所以互斥就是 $P(A \\cup B) = P(A) + P(B)$。

若 $P(A) = 0.3$，$P(B) = 0.5$，$P(A \\cup B) = 0.8$，则 $P(A \\cap B) = 0.3 + 0.5 - 0.8 = 0$：互斥。若 $P(A \\cup B) = 0.7$，则 $P(A \\cap B) = 0.1$：不互斥。

> **注意。** 只要重叠部分的概率为正，无论多小，两事件都能同时发生。互斥也不同于独立：独立讲的是 $P(A \\cap B) = P(A) \\times P(B)$。`,
      ),
      generate(rng) {
        const a = rng.int(5, 60);
        const b = rng.int(5, 95 - a);
        const exclusive = rng.bool();
        const ab = exclusive ? 0 : rng.int(1, Math.min(a, b) - 1);
        const u = a + b - ab;
        const regions = regionProbs(a, b, ab);
        const shown = exclusive ? [regions[0], regions[2], regions[3]] : regions;
        return {
          ...choiceProblem({
            prompt: t(
              `For events $A$ and $B$, $P(A) = ${pd(a)}$, $P(B) = ${pd(b)}$ and $P(A \\cup B) = ${pd(u)}$. Are $A$ and $B$ mutually exclusive?`,
              `事件 $A$、$B$ 满足 $P(A) = ${pd(a)}$，$P(B) = ${pd(b)}$，$P(A \\cup B) = ${pd(u)}$。$A$ 与 $B$ 互斥吗？`,
            ),
            options: yesNo,
            correct: exclusive ? 0 : 1,
            solution: t(
              `${stepLabel(1, "find the overlap", "求重叠部分").en} Rearrange the addition law:${steps(`P(A \\cap B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}${stepLabel(2, "decide", "下结论").en} ${exclusive ? "The intersection has probability $0$, so the events never happen together: the circles do not overlap, and they are mutually exclusive." : "The intersection has a positive probability, so the events can happen together: the circles overlap, and they are not mutually exclusive."}

{{figure 0}}

**Check.** The regions, $${shown.join(", ")}$, add to $1$.`,
              `${stepLabel(1, "find the overlap", "求重叠部分")["zh-CN"]}将加法公式变形：${steps(`P(A \\cap B) = ${pd(a)} + ${pd(b)} - ${pd(u)} = ${pd(ab)}`)}${stepLabel(2, "decide", "下结论")["zh-CN"]}${exclusive ? "交集的概率为 $0$，两事件永远不会同时发生：两圆不相交，所以它们互斥。" : "交集的概率为正，两事件可以同时发生：两圆相交，所以它们不互斥。"}

{{figure 0}}

**检验。** 各区域 $${shown.join("$、$")}$ 之和为 $1$。`,
            ),
          }),
          solutionFigures: [probVenn(regions, exclusive ? unionShade : overlapShade, exclusive)],
        };
      },
    },
  ],
};

export const probabilityTopics: readonly TopicDef[] = [
  sets,
  experimentalProbability,
  usingExperimentalProbabilityToMakePredictions,
  sampleSpacesAndEventsInProbability,
  theLikelihoodOfAnEvent,
  singleEventsInProbability,
  usingProbabilityToMakePredictions,
  theComplementOfAnEvent,
  vennDiagramsInProbability,
  geometricProbability,
  theUnionOfSets,
  theIntersectionOfSets,
  compoundEventsInProbabilityFromExperimentalData,
  computingProbabilitiesForCompoundEventsUsingVennDiagrams,
  computingProbabilitiesOfEventsContainingComplementsUsingVennDiagrams,
  computingProbabilitiesForThreeEventsUsingVennDiagrams,
  theAdditionLawOfProbability,
  applyingTheAdditionLawWithEventComplements,
  mutuallyExclusiveEvents,
];
