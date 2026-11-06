// Kit of the drawings of discrete structures: graphs, tables and bowed arrows.

import type { Mark, Point } from "@ga/subject-math";
import { head } from "./explanation-drawings-calculus-kit.ts";
import { chain } from "./explanation-drawings-charts.ts";
import { dotAt, note, ring, seg } from "./explanation-drawings-kit.ts";

type Tone = "action" | "result";
type Compass = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

/** Vertices maps the name of each vertex to its place in the drawing. */
export type Vertices = Readonly<Record<string, Point>>;

/** NetOptions adjusts how net draws a graph. */
export interface NetOptions {
  /** arcs draws the edges as arrows from the first vertex to the second. */
  readonly arcs?: boolean;
  /** tones gives some vertices another tone. */
  readonly tones?: Readonly<Record<string, Tone>>;
  /** names replaces the labels of some vertices; an empty name hides a label. */
  readonly names?: Readonly<Record<string, string>>;
  /** dirs places some labels on a given side of their vertices. */
  readonly dirs?: Readonly<Record<string, Compass>>;
  /** plain hides every label that names does not give. */
  readonly plain?: boolean;
}

/** around places the named vertices evenly on a circle, starting at an angle in degrees and going clockwise. */
export const around = (names: readonly string[], r = 2, c: Point = [0, 0], start = 90): Vertices =>
  Object.fromEntries(
    names.map((n, i) => {
      const a = ((start - (360 * i) / names.length) * Math.PI) / 180;
      return [n, [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] as Point];
    }),
  );

const outward = (at: Point, c: Point): Compass => {
  const a = (Math.atan2(at[1] - c[1], at[0] - c[0]) * 180) / Math.PI;
  const order: Compass[] = ["e", "ne", "n", "nw", "w", "sw", "s", "se"];
  return order[((Math.round(a / 45) % 8) + 8) % 8] as Compass;
};

/**
 * net draws a graph. Each edge is written "A-B", with an optional leading * for
 * the result tone or ~ for a dashed line, an optional ":w" for a label on it and
 * an optional ":dir" for the side of that label.
 */
export const net = (v: Vertices, edges: readonly string[], o: NetOptions = {}): Mark[] => {
  const ps = Object.values(v);
  const c: Point = [ps.reduce((s, p) => s + p[0], 0) / ps.length, ps.reduce((s, p) => s + p[1], 0) / ps.length];
  const lines = edges.flatMap((e): Mark[] => {
    const [body = "", w, side] = e.split(":");
    const hot = body.startsWith("*");
    const dashed = body.startsWith("~");
    const [a = "", b = ""] = body.replace(/^[*~]/, "").split("-");
    const [p, q] = [v[a] as Point, v[b] as Point];
    const tone: Tone | undefined = hot ? "result" : undefined;
    const l = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const end: Point = o.arcs ? [q[0] - (0.14 * (q[0] - p[0])) / l, q[1] - (0.14 * (q[1] - p[1])) / l] : q;
    const mid: Point = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    return [
      ...(o.arcs ? head(p, end, tone) : [seg(p, q, tone, dashed)]),
      ...(w ? [note(mid, w, (side as Compass | undefined) ?? outward(mid, c))] : []),
    ];
  });
  const dots = Object.entries(v).flatMap(([n, at]) => {
    const name = o.names?.[n] ?? (o.plain ? "" : n);
    return dotAt(at, name || undefined, o.dirs?.[n] ?? outward(at, c), o.tones?.[n]);
  });
  return [...lines, ...dots];
};

/** sides places one list of names on a row at height h and another on a row at height 0, centered on x. */
export const sides = (top: readonly string[], bottom: readonly string[], x = 0, h = 2.4, gap = 1.2): Vertices => ({
  ...Object.fromEntries(top.map((n, i) => [n, [x + (i - (top.length - 1) / 2) * gap, h] as Point])),
  ...Object.fromEntries(bottom.map((n, i) => [n, [x + (i - (bottom.length - 1) / 2) * gap, 0] as Point])),
});

/** complete lists every edge between the named vertices. */
export const complete = (names: readonly string[]): string[] => names.flatMap((a, i) => names.slice(i + 1).map((b) => `${a}-${b}`));

/** missing lists the edges between the named vertices that a graph does not have. */
export const missing = (names: readonly string[], edges: readonly string[]): string[] =>
  complete(names).filter((e) => !edges.includes(e) && !edges.includes(e.split("-").reverse().join("-")));

/** TableOptions adjusts how table draws a grid. */
export interface TableOptions {
  /** at is the top left corner of the grid. */
  readonly at?: Point;
  /** cell is the side of a cell. */
  readonly cell?: number;
  /** rows and cols name the rows and the columns. */
  readonly rows?: readonly string[];
  readonly cols?: readonly string[];
  /** shade lists the [row, column] of the cells to shade. */
  readonly shade?: readonly (readonly [number, number])[];
  /** other lists cells to shade in the action tone. */
  readonly other?: readonly (readonly [number, number])[];
  /** drop lowers the entries within their cells, as a share of the cell; large tables want more. */
  readonly drop?: number;
}

/** table draws a grid of entries, row by row from the top. */
export const table = (entries: readonly (readonly string[])[], o: TableOptions = {}): Mark[] => {
  const [x0, y0] = o.at ?? [0, 0];
  const k = o.cell ?? 1;
  const h = entries.length;
  const w = entries[0]?.length ?? 0;
  const cellShade = (cells: readonly (readonly [number, number])[], tone: Tone): Mark[] =>
    cells.map(
      ([r, c]): Mark => ({
        kind: "shade",
        points: [
          [x0 + c * k, y0 - r * k],
          [x0 + (c + 1) * k, y0 - r * k],
          [x0 + (c + 1) * k, y0 - (r + 1) * k],
          [x0 + c * k, y0 - (r + 1) * k],
        ],
        tone,
      }),
    );
  return [
    ...cellShade(o.shade ?? [], "result"),
    ...cellShade(o.other ?? [], "action"),
    ...Array.from({ length: h + 1 }, (_, r) => seg([x0, y0 - r * k], [x0 + w * k, y0 - r * k])),
    ...Array.from({ length: w + 1 }, (_, c) => seg([x0 + c * k, y0], [x0 + c * k, y0 - h * k])),
    ...entries.flatMap((row, r) => row.map((text, c) => note([x0 + (c + 0.5) * k, y0 - (r + 0.5) * k - (o.drop ?? 0.13) * k], text, "n"))),
    ...(o.rows ?? []).map((text, r) => note([x0 - 0.08, y0 - (r + 0.5) * k], text, "w")),
    ...(o.cols ?? []).map((text, c) => note([x0 + (c + 0.5) * k, y0 + 0.04], text, "n")),
  ];
};

/** bow draws an arrow from a to b along an arc that bulges by h to the left of the direction of travel. */
export const bow = (a: Point, b: Point, h: number, s?: Tone, arrow = true): Mark[] => {
  const n: Point = [-(b[1] - a[1]), b[0] - a[0]];
  const l = Math.hypot(n[0], n[1]);
  const c: Point = [(a[0] + b[0]) / 2 + (n[0] / l) * 2 * h, (a[1] + b[1]) / 2 + (n[1] / l) * 2 * h];
  const at = (t: number): Point => [
    (1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * c[0] + t * t * b[0],
    (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * c[1] + t * t * b[1],
  ];
  const points = Array.from({ length: 25 }, (_, i) => at((i / 24) * 0.96));
  return [...chain(points, s), ...(arrow ? head(at(0.9), at(0.96), s) : [])];
};

/** loop draws a small loop at a vertex, on the side given by an angle in degrees. */
export const loop = (at: Point, degrees: number, r = 0.35, s?: Tone): Mark => {
  const a = (degrees * Math.PI) / 180;
  return ring(r, [at[0] + r * Math.cos(a), at[1] + r * Math.sin(a)], s);
};

/** tiling cuts a w by h rectangle into the largest squares, then the leftover into the next largest, and so on, labeling the squares at least as large as big. */
export const tiling = (w: number, h: number, k = 1, big = 1): Mark[] => {
  const out: Mark[] = [];
  let [x, y, W, H, stage] = [0, 0, w, h, 0];
  while (W > 0 && H > 0) {
    const side = Math.min(W, H);
    const q = Math.floor(Math.max(W, H) / side);
    for (let i = 0; i < q; i++) {
      const [a, b] = W >= H ? [x + i * side, y] : [x, y + i * side];
      const pts: Point[] = [
        [a * k, b * k],
        [(a + side) * k, b * k],
        [(a + side) * k, (b + side) * k],
        [a * k, (b + side) * k],
      ];
      if (stage % 2 === 0) out.push({ kind: "shade", points: pts, tone: "result" });
      out.push({ kind: "polygon", points: pts });
      if (side >= big) out.push(note([(a + side / 2) * k, (b + side / 2) * k - 0.15], String(side), "n"));
    }
    if (W >= H) {
      x += q * side;
      W -= q * side;
    } else {
      y += q * side;
      H -= q * side;
    }
    stage++;
  }
  return out;
};
