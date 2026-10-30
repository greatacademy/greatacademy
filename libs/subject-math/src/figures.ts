// SVG drawings for math figures. They follow docs/content.md §4: drawn in
// currentColor, with class "accent" on the marks a client may color, and only
// language-neutral text.

/** Axis is a number line under a plot: from min to max, a tick every step, a number every labelEvery ticks. */
export interface Axis {
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly labelEvery?: number;
}

const width = 320;
const margin = 20;

const round = (x: number) => Math.round(x * 100) / 100;

/** svgDocument wraps drawing elements in an SVG document of the given height. */
export function svgDocument(height: number, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" fill="none" stroke="currentColor" stroke-width="1.5" font-size="12" text-anchor="middle">${body}</svg>`;
}

function scale(axis: Axis): (v: number) => number {
  return (v) => round(margin + ((v - axis.min) / (axis.max - axis.min)) * (width - 2 * margin));
}

/** axisLine draws a number line at height y, with its ticks and numbers. */
function axisLine(axis: Axis, y: number): string {
  const x = scale(axis);
  const every = axis.labelEvery ?? 1;
  let out = `<line x1="${x(axis.min)}" y1="${y}" x2="${x(axis.max)}" y2="${y}"/>`;
  const ticks = Math.round((axis.max - axis.min) / axis.step);
  for (let i = 0; i <= ticks; i++) {
    const v = round(axis.min + i * axis.step);
    out += `<line x1="${x(v)}" y1="${y - 4}" x2="${x(v)}" y2="${y + 4}"/>`;
    if (i % every === 0) out += `<text x="${x(v)}" y="${y + 18}">${v}</text>`;
  }
  return out;
}

/** dotPlot draws a dot plot: one dot per value, stacked above the axis. */
export function dotPlot(values: readonly number[], axis: Axis): string {
  const x = scale(axis);
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  const tallest = Math.max(0, ...counts.values());
  const gap = 14;
  const base = 12 + tallest * gap;
  let dots = "";
  for (const [v, n] of counts) {
    for (let i = 0; i < n; i++)
      dots += `<circle class="accent" cx="${x(v)}" cy="${base - 4 - i * gap}" r="5" fill="currentColor" stroke="none"/>`;
  }
  return svgDocument(base + 26, dots + axisLine(axis, base + 4));
}

/** FiveNumberSummary is the minimum, first quartile, median, third quartile and maximum of a data set. */
export type FiveNumberSummary = readonly [number, number, number, number, number];

/** boxPlot draws a box plot of a five-number summary above the axis. */
export function boxPlot(summary: FiveNumberSummary, axis: Axis): string {
  const x = scale(axis);
  const [lo, q1, med, q3, hi] = summary.map(x) as unknown as FiveNumberSummary;
  const [top, mid, bottom] = [10, 30, 50];
  const box =
    `<g class="accent">` +
    `<line x1="${lo}" y1="${mid}" x2="${q1}" y2="${mid}"/><line x1="${q3}" y1="${mid}" x2="${hi}" y2="${mid}"/>` +
    `<line x1="${lo}" y1="${top + 8}" x2="${lo}" y2="${bottom - 8}"/><line x1="${hi}" y1="${top + 8}" x2="${hi}" y2="${bottom - 8}"/>` +
    `<rect x="${q1}" y="${top}" width="${round(q3 - q1)}" height="${bottom - top}"/>` +
    `<line x1="${med}" y1="${top}" x2="${med}" y2="${bottom}" stroke-width="2.5"/>` +
    `</g>`;
  return svgDocument(90, box + axisLine(axis, 64));
}
