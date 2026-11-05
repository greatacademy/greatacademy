// Drawing helpers for figures whose two axes have different scales: densities, solution curves and bar charts.

import { svgDocument } from "@ga/subject-math";

import { label } from "./figure-reading-more.ts";

/** Scale maps a value on an axis to a position in the drawing. */
export type Scale = (v: number) => number;

/** chart draws axes with separate scales, since a density is usually far shorter than it is wide. */
export function chart(
  xRange: readonly [number, number],
  yRange: readonly [number, number],
  xTicks: readonly (readonly [number, string])[],
  yTicks: readonly (readonly [number, string])[],
  draw: (x: Scale, y: Scale) => string,
): string {
  const [left, right, top, bottom] = [40, 308, 14, 186];
  const x: Scale = (v) => Math.round((left + ((v - xRange[0]) * (right - left)) / (xRange[1] - xRange[0])) * 10) / 10;
  const y: Scale = (v) => Math.round((bottom - ((v - yRange[0]) * (bottom - top)) / (yRange[1] - yRange[0])) * 10) / 10;
  let body = `<line x1="${left}" y1="${bottom}" x2="${right}" y2="${bottom}"/><line x1="${left}" y1="${bottom}" x2="${left}" y2="${top}"/>`;
  for (const [v, name] of xTicks)
    body += `<line x1="${x(v)}" y1="${bottom}" x2="${x(v)}" y2="${bottom + 5}"/>${label(x(v), bottom + 18, name)}`;
  for (const [v, name] of yTicks)
    body += `<line x1="${left - 5}" y1="${y(v)}" x2="${left}" y2="${y(v)}"/>${label(left - 20, y(v) + 4, name)}`;
  return svgDocument(210, body + draw(x, y));
}

/** intTicks lists whole-number ticks with their labels. */
export const intTicks = (a: number, b: number, step = 1): [number, string][] => {
  const out: [number, string][] = [];
  for (let v = a; v <= b; v += step) out.push([v, String(v).replace("-", "−")]);
  return out;
};

/** tenthTicks lists ticks at multiples of one tenth, labelled in decimals. */
export const tenthTicks = (a: number, b: number, step = 1): [number, string][] => {
  const out: [number, string][] = [];
  for (let v = a; v <= b; v += step) out.push([v / 10, (v / 10).toFixed(1)]);
  return out;
};

/** curvePath draws a function as a polyline between two values. */
export function curvePath(
  f: (v: number) => number,
  from: number,
  to: number,
  x: Scale,
  y: Scale,
  extra = 'class="accent" stroke="currentColor"',
): string {
  const pts = Array.from({ length: 121 }, (_, i) => {
    const v = from + ((to - from) * i) / 120;
    return `${x(v)},${y(f(v))}`;
  });
  return `<polyline ${extra} fill="none" points="${pts.join(" ")}"/>`;
}

/** shadeUnder shades the part below a curve between two values. */
export function shadeUnder(f: (v: number) => number, from: number, to: number, x: Scale, y: Scale): string {
  const pts = Array.from({ length: 61 }, (_, i) => {
    const v = from + ((to - from) * i) / 60;
    return `${x(v)},${y(f(v))}`;
  });
  return `<polygon class="accent" fill="currentColor" fill-opacity="0.3" stroke="none" points="${x(from)},${y(0)} ${pts.join(" ")} ${x(to)},${y(0)}"/>`;
}

/** bars draws rectangles of a bar chart between given cut points. */
export const bars = (cuts: readonly number[], values: readonly number[], x: Scale, y: Scale) =>
  values
    .map((v, i) => {
      const [a, b] = [cuts[i] as number, cuts[i + 1] as number];
      return `<rect x="${x(a)}" y="${y(v)}" width="${x(b) - x(a)}" height="${y(0) - y(v)}" fill="none" class="accent" stroke="currentColor"/>`;
    })
    .join("");

/** normal is the density of a normal distribution. */
export const normal = (mu: number, sigma: number) => (v: number) =>
  Math.exp(-((v - mu) ** 2) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));
