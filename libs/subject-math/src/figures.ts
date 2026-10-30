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

/** Point is a point in a sketch's own coordinates, with y pointing up. */
export type Point = readonly [number, number];

/** Compass is the direction from a point to its label. */
export type Compass = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

/** Mark is one element of a geometry sketch. */
export type Mark =
  | { readonly kind: "segment"; readonly a: Point; readonly b: Point; readonly accent?: boolean; readonly dashed?: boolean }
  | { readonly kind: "polygon"; readonly points: readonly Point[]; readonly accent?: boolean }
  /** arc marks the angle at vertex between the rays to from and to (the smaller one), with an optional label inside. */
  | {
      readonly kind: "arc";
      readonly vertex: Point;
      readonly from: Point;
      readonly to: Point;
      readonly label?: string;
      readonly accent?: boolean;
    }
  /** right marks a right angle at vertex with a small square. */
  | { readonly kind: "right"; readonly vertex: Point; readonly from: Point; readonly to: Point }
  | { readonly kind: "label"; readonly at: Point; readonly text: string; readonly dir: Compass; readonly italic?: boolean }
  /** side labels the segment from a to b on its right-hand side (outside a counterclockwise polygon). */
  | { readonly kind: "side"; readonly a: Point; readonly b: Point; readonly text: string }
  | { readonly kind: "dot"; readonly at: Point }
  /** ticks marks congruent segments with count small strokes. */
  | { readonly kind: "ticks"; readonly a: Point; readonly b: Point; readonly count: number }
  /** arrows marks parallel segments with count chevrons pointing from a to b. */
  | { readonly kind: "arrows"; readonly a: Point; readonly b: Point; readonly count: number };

const compass: Record<Compass, Point> = {
  n: [0, -1],
  ne: [0.71, -0.71],
  e: [1, 0],
  se: [0.71, 0.71],
  s: [0, 1],
  sw: [-0.71, 0.71],
  w: [-1, 0],
  nw: [-0.71, -0.71],
};

/** Bounds is the box a sketch's drawing covers, grown by every element drawn. */
class Bounds {
  x0 = Number.POSITIVE_INFINITY;
  y0 = Number.POSITIVE_INFINITY;
  x1 = Number.NEGATIVE_INFINITY;
  y1 = Number.NEGATIVE_INFINITY;

  /** grow extends the box to cover (x, y). */
  grow(x: number, y: number): void {
    this.x0 = Math.min(this.x0, x);
    this.y0 = Math.min(this.y0, y);
    this.x1 = Math.max(this.x1, x);
    this.y1 = Math.max(this.y1, y);
  }
}

/** textAt writes a label centered at distance gap from (x, y) in screen direction u, clear of the point for any text width. */
function textAt(x: number, y: number, u: Point, gap: number, text: string, bounds: Bounds, italic = false): string {
  const half = 3.4 * text.length;
  const d = gap + Math.abs(u[0]) * half;
  const style = italic ? ' font-style="italic"' : "";
  const [cx, cy] = [round(x + u[0] * d), round(y + u[1] * d + 4)];
  bounds.grow(cx - half, cy - 10);
  bounds.grow(cx + half, cy + 3);
  return `<text x="${cx}" y="${cy}"${style}>${text}</text>`;
}

/**
 * sketch draws a geometry figure from marks in its own coordinates (y up),
 * scaled to fit about 280 × 180 so that labels keep the same size in every
 * figure. The view box covers everything drawn, labels included.
 */
export function sketch(marks: readonly Mark[]): string {
  const points = marks.flatMap((m): Point[] => {
    switch (m.kind) {
      case "polygon":
        return [...m.points];
      case "label":
      case "dot":
        return [m.at];
      case "arc":
      case "right":
        return [m.vertex];
      default:
        return [m.a, m.b];
    }
  });
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const s = Math.min(280 / (maxX - minX || 1), 180 / (maxY - minY || 1));
  const bounds = new Bounds();
  const at = (p: Point): Point => {
    const q: Point = [round((p[0] - minX) * s), round((maxY - p[1]) * s)];
    bounds.grow(q[0], q[1]);
    return q;
  };
  const unit = (from: Point, to: Point): Point => {
    const [dx, dy] = [to[0] - from[0], to[1] - from[1]];
    const n = Math.hypot(dx, dy) || 1;
    return [dx / n, dy / n];
  };
  let body = "";
  for (const m of marks) {
    switch (m.kind) {
      case "segment": {
        const [a, b] = [at(m.a), at(m.b)];
        const attrs = `${m.accent ? ' class="accent"' : ""}${m.dashed ? ' stroke-dasharray="5 4"' : ""}`;
        body += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"${attrs}/>`;
        break;
      }
      case "polygon":
        body += `<polygon points="${m.points.map((p) => at(p).join(",")).join(" ")}"${m.accent ? ' class="accent"' : ""}/>`;
        break;
      case "arc": {
        const v = at(m.vertex);
        const [u, w] = [unit(v, at(m.from)), unit(v, at(m.to))];
        const [a1, a2] = [Math.atan2(u[1], u[0]), Math.atan2(w[1], w[0])];
        let delta = a2 - a1;
        // A straight angle (delta = ±π) is drawn counterclockwise on screen, above a horizontal line.
        while (delta >= Math.PI) delta -= 2 * Math.PI;
        while (delta < -Math.PI) delta += 2 * Math.PI;
        const r = Math.abs(delta) < 0.6 ? 34 : 22;
        const p1 = [round(v[0] + u[0] * r), round(v[1] + u[1] * r)];
        const p2 = [round(v[0] + w[0] * r), round(v[1] + w[1] * r)];
        const cls = m.accent ? ' class="accent"' : "";
        body += `<path d="M${p1[0]} ${p1[1]}A${r} ${r} 0 0 ${delta > 0 ? 1 : 0} ${p2[0]} ${p2[1]}"${cls}/>`;
        const mid = a1 + delta / 2;
        bounds.grow(v[0] + Math.cos(mid) * r, v[1] + Math.sin(mid) * r);
        if (m.label) {
          // A long label in a narrow angle moves out along the bisector to clear both rays, but not so far that it meets the labels at other corners.
          const gap = Math.min(Math.max(r + 13, (2.4 * m.label.length + 6) / Math.sin(Math.abs(delta) / 2)), 58);
          body += textAt(v[0], v[1], [Math.cos(mid), Math.sin(mid)], gap, m.label, bounds, /^[a-z]$/.test(m.label));
        }
        break;
      }
      case "right": {
        const v = at(m.vertex);
        const [u, w] = [unit(v, at(m.from)), unit(v, at(m.to))];
        const k = 10;
        const q = (a: number, b: number) => `${round(v[0] + a * u[0] + b * w[0])},${round(v[1] + a * u[1] + b * w[1])}`;
        body += `<polyline points="${q(k, 0)} ${q(k, k)} ${q(0, k)}"/>`;
        break;
      }
      case "label": {
        const p = at(m.at);
        body += textAt(p[0], p[1], compass[m.dir], 10, m.text, bounds, m.italic);
        break;
      }
      case "side": {
        const [a, b] = [at(m.a), at(m.b)];
        const d = unit(a, b);
        // In screen coordinates (y down), the right-hand side of a→b in the sketch's own coordinates is (−dy, dx).
        body += textAt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, [-d[1], d[0]], 10, m.text, bounds);
        break;
      }
      case "dot": {
        const p = at(m.at);
        body += `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="currentColor" stroke="none"/>`;
        break;
      }
      case "ticks":
      case "arrows": {
        const [a, b] = [at(m.a), at(m.b)];
        const d = unit(a, b);
        const n: Point = [-d[1], d[0]];
        // Arrows sit a quarter of the way along, clear of a transversal crossing the middle.
        const f = m.kind === "ticks" ? 0.5 : 0.25;
        const mid: Point = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
        for (let i = 0; i < m.count; i++) {
          const o = (i - (m.count - 1) / 2) * 5;
          const c: Point = [mid[0] + d[0] * o, mid[1] + d[1] * o];
          const p = (along: number, across: number) =>
            `${round(c[0] + d[0] * along + n[0] * across)},${round(c[1] + d[1] * along + n[1] * across)}`;
          body +=
            m.kind === "ticks" ? `<polyline points="${p(0, -5)} ${p(0, 5)}"/>` : `<polyline points="${p(-4, -5)} ${p(1, 0)} ${p(-4, 5)}"/>`;
        }
        break;
      }
    }
  }
  const margin = 12;
  const box = [bounds.x0 - margin, bounds.y0 - margin, bounds.x1 - bounds.x0 + 2 * margin, bounds.y1 - bounds.y0 + 2 * margin].map(round);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.join(" ")}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" font-size="13" text-anchor="middle">${body}</svg>`;
}
