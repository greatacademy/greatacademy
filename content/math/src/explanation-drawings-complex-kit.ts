// Kit of the drawings of complex analysis: planes, circles with a direction, wedges and maps.

import type { Mark, Point } from "@ga/subject-math";
import { head } from "./explanation-drawings-calculus-kit.ts";
import { chain } from "./explanation-drawings-charts.ts";
import { note, ring, seg } from "./explanation-drawings-kit.ts";

type Tone = "action" | "result";

/** polar is the point at a distance and an angle in degrees from a center. */
export const polar = (c: Point, r: number, degrees: number): Point => [
  c[0] + r * Math.cos((degrees * Math.PI) / 180),
  c[1] + r * Math.sin((degrees * Math.PI) / 180),
];

/** plane draws the axes of a complex plane around a center, reaching rx across and ry up. */
export const plane = (c: Point, rx: number, ry = rx, xName = "Re", yName = "Im"): Mark[] => [
  ...head([c[0] - rx, c[1]], [c[0] + rx, c[1]]),
  ...head([c[0], c[1] - ry], [c[0], c[1] + ry]),
  note([c[0] + rx, c[1]], xName, "e"),
  note([c[0], c[1] + ry], yName, "n"),
];

/** spin draws an arrow along a circle at an angle in degrees, counterclockwise unless ccw is false. */
export const spin = (c: Point, r: number, degrees: number, ccw = true, s?: Tone): Mark[] => {
  const step = ((ccw ? 1 : -1) * 0.25 * 180) / Math.PI / r;
  return head(polar(c, r, degrees - step), polar(c, r, degrees + step), s);
};

/** loopOf draws a circle with an arrow on it. */
export const loopOf = (c: Point, r: number, degrees = 45, ccw = true, s?: Tone): Mark[] => [ring(r, c, s), ...spin(c, r, degrees, ccw, s)];

/** dashedRing draws a circle in pieces, which reads as dashed at any size. */
export const dashedRing = (c: Point, r: number, s?: Tone): Mark[] => {
  const pieces = Math.max(12, Math.round((2 * Math.PI * r) / 0.5));
  return Array.from({ length: pieces }, (_, i) =>
    chain(
      Array.from({ length: 5 }, (_, j) => polar(c, r, ((i + (j / 4) * 0.55) * 360) / pieces)),
      s,
    ),
  ).flat();
};

/** disc shades the inside of a circle, leaving out a smaller circle around the same center when one is given. */
export const disc = (c: Point, r: number, hole?: number, s: Tone = "result"): Mark => {
  const round = (k: number): Point[] => Array.from({ length: 96 }, (_, i) => polar(c, k, i * 3.75));
  return { kind: "shade", points: round(r), ...(hole ? { holes: [round(hole)] } : {}), tone: s };
};

/** sector shades and outlines the part of a disc between two angles in degrees. */
export const sector = (c: Point, r: number, from: number, to: number, s: Tone = "result"): Mark[] => {
  const n = Math.max(4, Math.ceil((to - from) / 4));
  const arc = Array.from({ length: n + 1 }, (_, i) => polar(c, r, from + ((to - from) * i) / n));
  return [{ kind: "shade", points: [c, ...arc], tone: s }, seg(c, arc[0] as Point, s), seg(c, arc[n] as Point, s), ...chain(arc, s)];
};

/** maps draws an arrow between two panels with the name of the map above it. */
export const maps = (x: number, y: number, text: string, width = 1.6): Mark[] => [
  ...head([x - width / 2, y], [x + width / 2, y]),
  note([x, y + 0.05], text, "n"),
];

/** upperPath draws a real segment closed by the upper semicircle of radius r, counterclockwise. */
export const upperPath = (c: Point, r: number, s?: Tone): Mark[] => [
  seg([c[0] - r, c[1]], [c[0] + r, c[1]], s),
  ...chain(
    Array.from({ length: 49 }, (_, i) => polar(c, r, i * 3.75)),
    s,
  ),
  ...head([c[0] - 0.2, c[1]], [c[0] + 0.2, c[1]], s),
  ...spin(c, r, 60, true, s),
];

/** Plot describes the scales of a drawn graph over an interval. */
export interface Plot {
  /** at turns a point of the graph into a point of the drawing. */
  readonly at: (x: number, y: number) => Point;
  /** axes are the marks of its two axes. */
  readonly axes: Mark[];
}

/** plot makes axes for a graph with its own horizontal and vertical scales. */
export const plot = (dx: number, kx: number, ky: number, xMax: number, yMin: number, yMax: number, xName = "θ", yName = "u"): Plot => ({
  at: (x, y) => [dx + kx * x, ky * y],
  axes: [
    ...head([dx, 0], [dx + kx * xMax, 0]),
    ...head([dx, ky * yMin], [dx, ky * yMax]),
    note([dx + kx * xMax, 0], xName, "e"),
    note([dx, ky * yMax], yName, "n"),
  ],
});
