// Kit of the drawings of abstract algebra: numbered polygons, mirror lines, necklaces and solids.

import type { Mark, Point } from "@ga/subject-math";
import { head } from "./explanation-drawings-calculus-kit.ts";
import { disc, polar } from "./explanation-drawings-complex-kit.ts";
import { dotAt, ring, seg } from "./explanation-drawings-kit.ts";

type Tone = "action" | "result";
type Compass = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

/** sideOf names the compass side that points along an angle in degrees. */
export const sideOf = (deg: number): Compass => {
  const order: Compass[] = ["e", "ne", "n", "nw", "w", "sw", "s", "se"];
  return order[((Math.round(deg / 45) % 8) + 8) % 8] as Compass;
};

/** spots places n points evenly on a circle, counterclockwise from an angle in degrees. */
export const spots = (n: number, c: Point = [0, 0], r = 2, start = 0): Point[] =>
  Array.from({ length: n }, (_, i) => polar(c, r, start + (i * 360) / n));

/** SpotOptions adjusts how numbered labels the points of a circle. */
export interface SpotOptions {
  readonly c?: Point;
  readonly r?: number;
  readonly start?: number;
  /** hot lists the points in the result tone. */
  readonly hot?: readonly number[];
  /** cool lists the points in the action tone. */
  readonly cool?: readonly number[];
  /** name gives the label of a point; an empty one hides it. */
  readonly name?: (i: number) => string;
}

/** numbered draws n points evenly on a circle, labeled 0 to n − 1 unless a name is given. */
export const numbered = (n: number, o: SpotOptions = {}): Mark[] => {
  const { c = [0, 0], r = 2, start = 0 } = o;
  return spots(n, c, r, start).flatMap((p, i) =>
    dotAt(
      p,
      (o.name ? o.name(i) : String(i)) || undefined,
      sideOf(start + (i * 360) / n),
      o.hot?.includes(i) ? "result" : o.cool?.includes(i) ? "action" : undefined,
    ),
  );
};

/** gon draws the regular n-gon with numbered vertices. */
export const gon = (n: number, o: SpotOptions = {}): Mark[] => [
  { kind: "polygon", points: spots(n, o.c ?? [0, 0], o.r ?? 2, o.start ?? 0) },
  ...numbered(n, o),
];

/** mirror draws a dashed line through a center at an angle in degrees. */
export const mirror = (deg: number, c: Point = [0, 0], reach = 2.5, s?: Tone): Mark =>
  seg(polar(c, reach, deg), polar(c, reach, deg + 180), s, true);

/** go draws an arrow from a to b that stops just short of b. */
export const go = (a: Point, b: Point, s?: Tone): Mark[] => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return head(a, [b[0] - (0.14 * (b[0] - a[0])) / l, b[1] - (0.14 * (b[1] - a[1])) / l], s);
};

/** swap draws an arrow in each direction between a and b. */
export const swap = (a: Point, b: Point, s?: Tone): Mark[] => [...go(a, b, s), ...go(b, a, s)];

/** tour draws arrows from point to point along a list of indices of the given points, closing the cycle. */
export const tour = (points: readonly Point[], order: readonly number[], s?: Tone): Mark[] =>
  order.flatMap((a, i) => go(points[a] as Point, points[order[(i + 1) % order.length] as number] as Point, s));

/** necklace draws n beads on a circle; the beads in the pattern, which repeats, are filled. */
export const necklace = (pattern: readonly boolean[], c: Point = [0, 0], r = 1.6, start = 90): Mark[] => [
  ring(r, c),
  ...spots(pattern.length, c, r, start).flatMap((p, i): Mark[] => [
    disc(p, 0.24, undefined, pattern[i] ? "result" : "action"),
    ring(0.24, p),
  ]),
];

/** see projects a point of space into the drawing: the x axis comes out towards the lower left. */
export const see = (p: readonly [number, number, number], k = 1.5, c: Point = [0, 0]): Point => [
  c[0] + k * (p[1] - 0.45 * p[0]),
  c[1] + k * (p[2] - 0.3 * p[0]),
];

/** cube draws the cube [−1, 1]³, with the three edges at the hidden corner dashed. */
export const cube = (k = 1.5, c: Point = [0, 0]): Mark[] => {
  const corners = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z] as const)));
  return corners.flatMap((a): Mark[] =>
    corners
      .filter((b) => a[0] + a[1] + a[2] < b[0] + b[1] + b[2] && Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) === 2)
      .map((b) => seg(see(a, k, c), see(b, k, c), undefined, a[0] + a[1] + a[2] === -3)),
  );
};
