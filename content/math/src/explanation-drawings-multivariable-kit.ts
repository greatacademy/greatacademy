// Helpers for the drawings of space: every point goes through one orthographic projection, so a sphere has a circle as its outline and parallel lines stay parallel.

import type { Mark, Point } from "@ga/subject-math";
import { head } from "./explanation-drawings-calculus-kit.ts";
import { chain } from "./explanation-drawings-charts.ts";
import { dotAt, note, ring, seg } from "./explanation-drawings-kit.ts";

type Tone = "action" | "result";
type Compass = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

/** P3 is a point or a vector of space. */
export type P3 = readonly [x: number, y: number, z: number];

const [az, el] = [(30 * Math.PI) / 180, (25 * Math.PI) / 180];
const right: P3 = [-Math.sin(az), Math.cos(az), 0];
const up: P3 = [-Math.cos(az) * Math.sin(el), -Math.sin(az) * Math.sin(el), Math.cos(el)];
const eye: P3 = [Math.cos(az) * Math.cos(el), Math.sin(az) * Math.cos(el), Math.sin(el)];

/** dot3 is the dot product of two vectors of space. */
export const dot3 = (a: P3, b: P3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** plus3 is the point a + s·b. */
export const plus3 = (a: P3, b: P3, s = 1): P3 => [a[0] + s * b[0], a[1] + s * b[1], a[2] + s * b[2]];

/** Scene draws points of space with one projection, at scale k and moved by (dx, dy) in the drawing. */
export interface Scene {
  /** p is where a point of space lands in the drawing. */
  p(a: P3): Point;
  /** axes gives the three coordinate axes with their letters, as long as asked. */
  axes(x: number, y: number, z: number): Mark[];
  /** arrow gives the arrow from a to b. */
  arrow(a: P3, b: P3, s?: Tone): Mark[];
  /** line gives the segment from a to b. */
  line(a: P3, b: P3, s?: Tone, dashed?: boolean): Mark[];
  /** curve gives the curve f(t) for t from a to b. */
  curve(f: (t: number) => P3, a: number, b: number, s?: Tone, dashed?: boolean, n?: number): Mark[];
  /** patch gives a shaded polygon of space with its outline. */
  patch(points: readonly P3[], s?: Tone): Mark[];
  /** dot gives a point with a name. */
  dot(a: P3, text?: string, dir?: Compass, s?: Tone): Mark[];
  /** say gives a label at a point. */
  say(a: P3, text: string, dir?: Compass): Mark[];
  /** mesh gives the lines of constant u and of constant v of a surface. */
  mesh(
    f: (u: number, v: number) => P3,
    u: readonly [number, number, number],
    v: readonly [number, number, number],
    s?: Tone,
    dashed?: boolean,
  ): Mark[];
  /** sphere gives the outline of a sphere and its equator, dashed behind. */
  sphere(r: number, c?: P3): Mark[];
  /** circle gives the circle c + r(cos t·u + sin t·v) of unit vectors u and v, dashed where it passes behind the point c seen from the eye, when asked to. */
  circle(c: P3, u: P3, v: P3, r: number, s?: Tone, hide?: boolean): Mark[];
}

const steps = (from: number, to: number, n: number): number[] =>
  n === 0 ? [] : Array.from({ length: n + 1 }, (_, i) => from + ((to - from) * i) / n);

/** scene starts a drawing of space at scale k, moved by (dx, dy). */
export function scene(k = 1, dx = 0, dy = 0): Scene {
  const p = (a: P3): Point => [dx + k * dot3(a, right), dy + k * dot3(a, up)];
  const self: Scene = {
    p,
    axes: (x, y, z) => [
      ...head(p([0, 0, 0]), p([x, 0, 0])),
      ...head(p([0, 0, 0]), p([0, y, 0])),
      ...head(p([0, 0, 0]), p([0, 0, z])),
      note(p([x, 0, 0]), "x", "sw"),
      note(p([0, y, 0]), "y", "e"),
      note(p([0, 0, z]), "z", "n"),
    ],
    arrow: (a, b, s) => head(p(a), p(b), s),
    line: (a, b, s, dashed = false) => [seg(p(a), p(b), s, dashed)],
    curve: (f, a, b, s, dashed = false, n = 80) =>
      chain(
        steps(a, b, n).map((t) => p(f(t))),
        s,
        dashed,
      ),
    patch: (points, s = "result") => {
      const ps = points.map(p);
      return [{ kind: "shade", points: ps, tone: s }, ...chain([...ps, ps[0] as Point], s)];
    },
    dot: (a, text, dir = "n", s) => dotAt(p(a), text, dir, s),
    say: (a, text, dir = "n") => [note(p(a), text, dir)],
    mesh: (f, [ua, ub, nu], [va, vb, nv], s, dashed = false) => [
      ...steps(ua, ub, nu).flatMap((u) =>
        chain(
          steps(va, vb, 30).map((v) => p(f(u, v))),
          s,
          dashed,
        ),
      ),
      ...steps(va, vb, nv).flatMap((v) =>
        chain(
          steps(ua, ub, 30).map((u) => p(f(u, v))),
          s,
          dashed,
        ),
      ),
    ],
    sphere: (r, c = [0, 0, 0]) => [ring(k * r, p(c)), ...self.circle(c, [1, 0, 0], [0, 1, 0], r, undefined, true)],
    circle: (c, u, v, r, s, hide = false) => {
      const at = (t: number): P3 => plus3(plus3(c, u, r * Math.cos(t)), v, r * Math.sin(t));
      if (!hide) return self.curve(at, 0, 2 * Math.PI, s, false, 96);
      const out: Mark[] = [];
      const ts = steps(0, 2 * Math.PI, 96);
      for (let i = 0; i < 96; i++) {
        const [a, b] = [at(ts[i] as number), at(ts[i + 1] as number)];
        const back = dot3(plus3(plus3(a, b), c, -2), eye) < 0;
        if (!back || i % 2 === 0) out.push(seg(p(a), p(b), s));
      }
      return out;
    },
  };
  return self;
}

const round = (n: number, f: (t: number) => Point): Point[] => Array.from({ length: n + 1 }, (_, i) => f((2 * Math.PI * i) / n));

/** disk gives a shaded disk. */
export const disk = (c: Point, r: number, s: Tone = "result"): Mark => ({
  kind: "shade",
  points: round(72, (t) => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]),
  tone: s,
});

/** flat gives a shaded polygon of the drawing with its outline. */
export const flat = (points: readonly Point[], s: Tone = "result", dashed = false): Mark[] => [
  { kind: "shade", points, tone: s },
  ...chain([...points, points[0] as Point], s, dashed),
];

/** cross gives two short axes through a point of the drawing with their letters. */
export const cross = (c: Point, r: number, names = true): Mark[] => [
  ...head([c[0] - r, c[1]], [c[0] + r, c[1]]),
  ...head([c[0], c[1] - r], [c[0], c[1] + r]),
  ...(names ? [note([c[0] + r, c[1]], "x", "e"), note([c[0], c[1] + r], "y", "n")] : []),
];

/** arrows gives the arrows of a plane field at the grid points around a center, each scaled by s. */
export const arrows = (F: (x: number, y: number) => Point, c: Point, grid: readonly number[], s: number, tone: Tone = "action"): Mark[] =>
  grid.flatMap((x) =>
    grid.flatMap((y) => {
      const [u, v] = F(x, y);
      if (u === 0 && v === 0) return [];
      return head([c[0] + x, c[1] + y], [c[0] + x + s * u, c[1] + y + s * v], tone);
    }),
  );

/** spin gives an arc with an arrowhead from angle a to angle b, in radians, around a center. */
export const spin = (c: Point, r: number, a: number, b: number, s: Tone = "action"): Mark[] => {
  const at = (t: number): Point => [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)];
  const ps = steps(a, b, 30).map(at);
  return [...chain(ps, s), ...head(ps[28] as Point, ps[30] as Point, s)];
};

/** swing gives the points of a curve of the plane for t from a to b. */
export const swing = (f: (t: number) => Point, a: number, b: number, n = 80): Point[] => steps(a, b, n).map(f);

/** band gives a shaded ring between two radii. */
export const band = (c: Point, inner: number, outer: number, s: Tone = "result"): Mark => ({
  kind: "shade",
  points: round(72, (t) => [c[0] + outer * Math.cos(t), c[1] + outer * Math.sin(t)]),
  holes: [round(72, (t) => [c[0] + inner * Math.cos(t), c[1] + inner * Math.sin(t)])],
  tone: s,
});

/** plate gives the four corners of a square of half-side r around a point, in the plane with normal n. */
export function plate(P: P3, n: P3, r: number): P3[] {
  const len = Math.sqrt(dot3(n, n));
  const m: P3 = [n[0] / len, n[1] / len, n[2] / len];
  const seed: P3 = Math.abs(m[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
  const c = (a: P3, b: P3): P3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const u0 = c(m, seed);
  const ul = Math.sqrt(dot3(u0, u0));
  const u: P3 = [u0[0] / ul, u0[1] / ul, u0[2] / ul];
  const v = c(m, u);
  return [plus3(plus3(P, u, r), v, r), plus3(plus3(P, u, -r), v, r), plus3(plus3(P, u, -r), v, -r), plus3(plus3(P, u, r), v, -r)];
}
