import type { Figure, Problem } from "@ga/content";
import { t } from "@ga/content";
import { type Compass, type PlaneMark, type PlaneView, type Point, plane, type Q, type RealSet } from "@ga/subject-math";
import { viewAround } from "./motion-figures.ts";

/** graphFigure draws marks in the coordinate plane as a figure, with its alt text in both languages. */
export function graphFigure(view: PlaneView, marks: readonly PlaneMark[], en: string, zh: string): Figure {
  return { svg: plane(view, marks), alt: t(en, zh) };
}

/** overlay draws more marks on top of a figure drawn with plane in the same view; a region or a polygon would belong under the axes, so it draws those itself in graphFigure instead. */
export function overlay(figure: Figure, view: PlaneView, marks: readonly PlaneMark[], en: string, zh: string): Figure {
  const bare = plane(view, []).slice(0, -6);
  const drawn = plane(view, marks);
  if (!drawn.startsWith(bare)) throw new Error("overlay takes marks that go on top of the axes");
  return { svg: `${figure.svg.slice(0, -6)}${drawn.slice(bare.length)}`, alt: t(en, zh) };
}

/** annotate gives a problem with a figure drawn with plane a solution figure: that figure with more marks on it. */
export function annotate<P extends Problem>(problem: P, view: PlaneView, marks: readonly PlaneMark[], en: string, zh: string): P {
  return problem.figure ? { ...problem, solutionFigure: overlay(problem.figure, view, marks, en, zh) } : problem;
}

/** num writes a number for alt text. */
const num = (x: number) => String(Math.round(x * 100) / 100);

/** minus writes a negative number with a proper minus sign. */
const minus = (s: string) => s.replace("-", "−");

/** plain writes a rational number for alt text. */
export const plain = (q: Q) => (q.d === 1n ? String(q.n) : `${q.n}/${q.d}`);

/** at writes a point for alt text. */
export const at = (p: Point) => `(${num(p[0])}, ${num(p[1])})`;

/** away is the compass direction from b toward a, for a label clear of the segment ab. */
export function away(a: Point, b: Point): Compass {
  const [dx, dy] = [a[0] - b[0], a[1] - b[1]];
  if (Math.abs(dx) >= 2 * Math.abs(dy)) return dx >= 0 ? "e" : "w";
  if (Math.abs(dy) >= 2 * Math.abs(dx)) return dy >= 0 ? "n" : "s";
  return dy >= 0 ? (dx >= 0 ? "ne" : "nw") : dx >= 0 ? "se" : "sw";
}

/** trail draws a point moving through stages, an arrow each: the first in the accent color, the last as the result, an empty name for no label. */
export function trail(names: readonly string[], points: readonly Point[]): PlaneMark[] {
  const marks: PlaneMark[] = [];
  for (let i = 0; i + 1 < points.length; i++)
    marks.push({ kind: "arrow", from: points[i]!, to: points[i + 1]!, tone: "action", thin: true });
  points.forEach((p, i) => {
    const neighbor = points[i === 0 ? 1 : i - 1] ?? p;
    const label = names[i] ? { label: names[i]!, dir: away(p, neighbor) } : {};
    marks.push(
      i === points.length - 1 ? { kind: "point", at: p, ...label, tone: "result" } : { kind: "point", at: p, ...label, accent: i === 0 },
    );
  });
  return marks;
}

/** guides draws dashed lines from a point of a graph to both axes, and the point as the result. */
export function guides(p: Point, label?: string): PlaneMark[] {
  return [
    { kind: "segment", a: [p[0], 0], b: p, dashed: true, tone: "action" },
    { kind: "segment", a: [0, p[1]], b: p, dashed: true, tone: "action" },
    { kind: "point", at: p, tone: "result", ...(label && { label, dir: "ne" as const }) },
  ];
}

/** riseRun draws the run and the rise from a to b as arrows, labeled with their sizes, or with labels when the drawing is to another scale. */
export function riseRun(a: Point, b: Point, labels?: readonly [string, string]): PlaneMark[] {
  const corner: Point = [b[0], a[1]];
  const [run, rise] = [b[0] - a[0], b[1] - a[1]];
  const marks: PlaneMark[] = [];
  if (run !== 0) {
    marks.push({ kind: "arrow", from: a, to: corner, tone: "action" });
    marks.push({ kind: "label", at: [(a[0] + b[0]) / 2, a[1]], text: minus(labels ? labels[0] : num(run)), dir: rise >= 0 ? "s" : "n" });
  }
  if (rise !== 0) {
    marks.push({ kind: "arrow", from: corner, to: b, tone: "action" });
    marks.push({ kind: "label", at: [b[0], (a[1] + b[1]) / 2], text: minus(labels ? labels[1] : num(rise)), dir: run >= 0 ? "e" : "w" });
  }
  return marks;
}

/** shift draws an arrow from a point of one graph to the same point of another, and the second point as the result. */
export function shift(from: Point, to: Point): PlaneMark[] {
  return [
    ...(from[0] === to[0] && from[1] === to[1] ? [] : [{ kind: "arrow", from, to, tone: "action" } as const]),
    { kind: "point", at: from, accent: true },
    { kind: "point", at: to, tone: "result" },
  ];
}

/** tracked draws a point moving through stages, for a solution that follows it step by step; names are the first and the last stage's. */
export function tracked(names: readonly [string, string], stages: readonly Point[]): Figure {
  const last = stages[stages.length - 1]!;
  const labels = stages.map((_, i) => (i === 0 ? names[0] : i === stages.length - 1 ? names[1] : ""));
  const chain = stages.map(at);
  return {
    svg: plane(viewAround(stages), trail(labels, stages)),
    alt: t(
      `${names[0]} moves along ${chain.join(", ")} and ends at ${names[1]} ${at(last)}.`,
      `${names[0]} 依次经过 ${chain.join("、")}，最后到达 ${names[1]} ${at(last)}。`,
    ),
  };
}

/** stagedPolygon draws a polygon, its dashed intermediate images and its final image in the result color, with arrows following one vertex. */
export function stagedPolygon(names: readonly string[], stages: readonly (readonly Point[])[], vertex = 0): Figure {
  const closed = (points: readonly Point[]) => [...points, points[0]!];
  const first = stages[0]!;
  const last = stages[stages.length - 1]!;
  const path = stages.map((s) => s[vertex]!);
  const marks: PlaneMark[] = stages.map(
    (s, i): PlaneMark => ({
      kind: "path",
      points: closed(s),
      ...(i === 0 ? { accent: true } : i === stages.length - 1 ? { tone: "result" as const } : { dashed: true }),
    }),
  );
  for (let i = 0; i + 1 < path.length; i++) marks.push({ kind: "arrow", from: path[i]!, to: path[i + 1]!, tone: "action", thin: true });
  marks.push(
    ...first.map((p, i): PlaneMark => ({ kind: "point", at: p, label: names[i]!, dir: away(p, last[i]!), accent: true })),
    ...last.map((p, i): PlaneMark => ({ kind: "point", at: p, label: `${names[i]}′`, dir: away(p, first[i]!), tone: "result" })),
  );
  const image = names.map((n) => `${n}′`).join("");
  return {
    svg: plane(viewAround(stages.flat()), marks),
    alt: t(
      `${names.join("")} and its image ${image}, with vertices ${last.map(at).join(", ")}.`,
      `${names.join("")} 和它的像 ${image}，顶点为 ${last.map(at).join("、")}。`,
    ),
  };
}

/** walkTo draws the walk from the origin to a point, along the horizontal axis and then up or down, and the point as the result. */
export function walkTo(p: Point, label?: string): PlaneMark[] {
  const marks: PlaneMark[] = [];
  if (p[0] !== 0) marks.push({ kind: "arrow", from: [0, 0], to: [p[0], 0], tone: "action" });
  if (p[1] !== 0) marks.push({ kind: "arrow", from: [p[0], 0], to: p, tone: "action" });
  marks.push({ kind: "point", at: p, tone: "result", ...(label && { label, dir: "ne" as const }) });
  return marks;
}

/** slopeFigure draws the line through a and b in the result color when it is the answer, with the run and the rise between them. */
export function slopeFigure(a: Point, b: Point, en: string, zh: string, answer = false): Figure {
  const line: PlaneMark = answer ? { kind: "line", a, b, tone: "result" } : { kind: "line", a, b, accent: true };
  return graphFigure(viewAround([a, b]), [line, ...riseRun(a, b), { kind: "point", at: a }, { kind: "point", at: b }], en, zh);
}

/** riseOf is the point one slope triangle away from p, for a slope in lowest terms. */
export const riseOf = (p: Point, m: Q): Point => [p[0] + Number(m.d), p[1] + Number(m.n)];

/** legs draws the horizontal and the vertical leg of the right triangle on a and b, dashed and labeled with their lengths. */
export function legs(a: Point, b: Point): PlaneMark[] {
  const corner: Point = [b[0], a[1]];
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  return [
    { kind: "segment", a, b: corner, dashed: true, tone: "action" },
    { kind: "segment", a: corner, b, dashed: true, tone: "action" },
    { kind: "label", at: [(a[0] + b[0]) / 2, a[1]], text: num(Math.abs(dx)), dir: dy >= 0 ? "s" : "n" },
    { kind: "label", at: [b[0], (a[1] + b[1]) / 2], text: num(Math.abs(dy)), dir: dx >= 0 ? "e" : "w" },
  ];
}

/** root writes the square root of n for a drawing: the whole number when it is one. */
export const root = (n: number) => (Number.isInteger(Math.sqrt(n)) ? String(Math.sqrt(n)) : `√${n}`);

/** sideLabels writes a label beside each side of a polygon, outside it. */
export function sideLabels(pts: readonly Point[], labels: readonly string[]): PlaneMark[] {
  const c: Point = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  return pts.map((p, i): PlaneMark => {
    const q = pts[(i + 1) % pts.length]!;
    const mid: Point = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    return { kind: "label", at: mid, text: labels[i]!, dir: away(mid, c) };
  });
}

/** pointMove draws a point and its image, each labeled with its coordinates, and the arrow from one to the other. */
export function pointMove(from: Point, to: Point): Figure {
  const marks: PlaneMark[] = [
    ...(from[0] === to[0] && from[1] === to[1] ? [] : [{ kind: "arrow", from, to, tone: "action" } as const]),
    { kind: "point", at: from, label: at(from), dir: away(from, to), accent: true },
    { kind: "point", at: to, label: at(to), dir: away(to, from), tone: "result" },
  ];
  return graphFigure(viewAround([from, to]), marks, `The point ${at(from)} moves to ${at(to)}.`, `点 ${at(from)} 移到 ${at(to)}。`);
}

/** onAxis draws a set of numbers on an axis in the result color, with a hollow dot at an end it leaves out; an unbounded end runs to reach. */
export function onAxis(axis: "x" | "y", set: RealSet, reach: number): PlaneMark[] {
  const place = (v: number): Point => (axis === "x" ? [v, 0] : [0, v]);
  return set.flatMap((i): PlaneMark[] => {
    const [lo, hi] = [i.lo?.toNumber(), i.hi?.toNumber()];
    return [
      { kind: "segment", a: place(lo ?? -reach), b: place(hi ?? reach), tone: "result" },
      ...(lo === undefined ? [] : [{ kind: "point", at: place(lo), open: !i.loClosed, tone: "result" } as const]),
      ...(hi === undefined ? [] : [{ kind: "point", at: place(hi), open: !i.hiClosed, tone: "result" } as const]),
    ];
  });
}

/** setText writes a set of numbers in interval notation for alt text. */
export const setText = (set: RealSet) =>
  set.map((i) => `${i.loClosed ? "[" : "("}${i.lo ? plain(i.lo) : "-∞"}, ${i.hi ? plain(i.hi) : "∞"}${i.hiClosed ? "]" : ")"}`).join(" ∪ ");

/** stretchOf draws the part of a graph of line segments between two x values in the result color. */
export function stretchOf(pts: readonly Point[], lo: number, hi: number): PlaneMark {
  return { kind: "path", points: pts.filter((p) => p[0] >= lo && p[0] <= hi), tone: "result" };
}

/** hits draws a dashed horizontal line at height y and the points where a graph meets it as the result. */
export function hits(y: number, xs: readonly number[]): PlaneMark[] {
  return [
    { kind: "line", a: [0, y], b: [1, y], dashed: true, tone: "action" },
    ...xs.map((x): PlaneMark => ({ kind: "point", at: [x, y], tone: "result" })),
  ];
}
