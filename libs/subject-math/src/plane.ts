// Graphs in the coordinate plane, following the figure rules of
// docs/content.md §4. SVG clip paths are not allowed in figures, so every
// curve, line and region is clipped to the view here.

import type { Compass, Point } from "./figures.ts";

/** PlaneView is the visible window of the coordinate plane, with grid lines every step and numbers every labelEvery grid lines. */
export interface PlaneView {
  readonly xMin: number;
  readonly xMax: number;
  readonly yMin: number;
  readonly yMax: number;
  readonly step?: number;
  readonly labelEvery?: number;
}

/** HalfPlane [a, b, c] is the set of points with a·x + b·y + c ≥ 0. */
export type HalfPlane = readonly [number, number, number];

/** PlaneMark is one element of a graph in the coordinate plane. */
export type PlaneMark =
  /** curve draws y = f(x) for x from from to to (the whole view by default), broken where it leaves the view or f is not finite. */
  | {
      readonly kind: "curve";
      readonly f: (x: number) => number;
      readonly from?: number;
      readonly to?: number;
      readonly accent?: boolean;
      readonly dashed?: boolean;
    }
  /** line draws the whole line through a and b. */
  | { readonly kind: "line"; readonly a: Point; readonly b: Point; readonly accent?: boolean; readonly dashed?: boolean }
  | { readonly kind: "segment"; readonly a: Point; readonly b: Point; readonly accent?: boolean; readonly dashed?: boolean }
  /** point draws a dot, hollow when open, with an optional label. */
  | {
      readonly kind: "point";
      readonly at: Point;
      readonly open?: boolean;
      readonly label?: string;
      readonly dir?: Compass;
      readonly accent?: boolean;
    }
  /** region shades the part of the view where every half-plane holds. */
  | { readonly kind: "region"; readonly halfPlanes: readonly HalfPlane[] }
  | { readonly kind: "label"; readonly at: Point; readonly text: string; readonly dir: Compass };

const size = 260;
const pad = 22;
const round = (x: number) => Math.round(x * 100) / 100;

const offsets: Record<Compass, Point> = {
  n: [0, -1],
  ne: [0.71, -0.71],
  e: [1, 0],
  se: [0.71, 0.71],
  s: [0, 1],
  sw: [-0.71, 0.71],
  w: [-1, 0],
  nw: [-0.71, -0.71],
};

/** clipPolygon keeps the part of a convex polygon where a·x + b·y + c ≥ 0 (Sutherland–Hodgman). */
function clipPolygon(points: readonly Point[], [a, b, c]: HalfPlane): Point[] {
  const out: Point[] = [];
  const inside = (p: Point) => a * p[0] + b * p[1] + c >= -1e-9;
  for (let i = 0; i < points.length; i++) {
    const p = points[i]!;
    const q = points[(i + 1) % points.length]!;
    if (inside(p)) out.push(p);
    if (inside(p) !== inside(q)) {
      const fp = a * p[0] + b * p[1] + c;
      const fq = a * q[0] + b * q[1] + c;
      const t = fp / (fp - fq);
      out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
    }
  }
  return out;
}

/** clipSegment clips the segment from p to q to the view (Liang–Barsky), or returns undefined when it misses it. */
function clipSegment(p: Point, q: Point, v: PlaneView): [Point, Point] | undefined {
  let [t0, t1] = [0, 1];
  const [dx, dy] = [q[0] - p[0], q[1] - p[1]];
  const edges: [number, number][] = [
    [-dx, p[0] - v.xMin],
    [dx, v.xMax - p[0]],
    [-dy, p[1] - v.yMin],
    [dy, v.yMax - p[1]],
  ];
  for (const [pk, qk] of edges) {
    if (pk === 0) {
      if (qk < 0) return undefined;
    } else {
      const r = qk / pk;
      if (pk < 0) t0 = Math.max(t0, r);
      else t1 = Math.min(t1, r);
    }
  }
  if (t0 > t1) return undefined;
  return [
    [p[0] + t0 * dx, p[1] + t0 * dy],
    [p[0] + t1 * dx, p[1] + t1 * dy],
  ];
}

/**
 * plane draws a graph in the coordinate plane: a light grid, the axes with
 * numbers, and the marks, with one unit the same length on both axes.
 */
export function plane(view: PlaneView, marks: readonly PlaneMark[]): string {
  const { xMin, xMax, yMin, yMax } = view;
  const step = view.step ?? 1;
  const every = view.labelEvery ?? 1;
  const s = Math.min(size / (xMax - xMin), size / (yMax - yMin));
  const sx = (x: number) => round(pad + (x - xMin) * s);
  const sy = (y: number) => round(pad + (yMax - y) * s);
  const [w, h] = [round((xMax - xMin) * s + 2 * pad), round((yMax - yMin) * s + 2 * pad)];
  const attrs = (m: { accent?: boolean; dashed?: boolean }) =>
    `${m.accent ? ' class="accent"' : ""}${m.dashed ? ' stroke-dasharray="6 4"' : ""}`;
  const polyline = (pts: readonly Point[], m: { accent?: boolean; dashed?: boolean }) =>
    `<polyline points="${pts.map((p) => `${sx(p[0])},${sy(p[1])}`).join(" ")}"${attrs(m)} stroke-width="2"/>`;

  let grid = `<g stroke-width="0.6" stroke-opacity="0.2">`;
  const first = (lo: number) => Math.ceil(lo / step - 1e-9) * step;
  for (let x = first(xMin); x <= xMax + 1e-9; x += step) grid += `<line x1="${sx(x)}" y1="${sy(yMin)}" x2="${sx(x)}" y2="${sy(yMax)}"/>`;
  for (let y = first(yMin); y <= yMax + 1e-9; y += step) grid += `<line x1="${sx(xMin)}" y1="${sy(y)}" x2="${sx(xMax)}" y2="${sy(y)}"/>`;
  grid += "</g>";

  let axes = "";
  let numbers = `<g stroke="none" fill="currentColor" font-size="10">`;
  const y0 = Math.min(Math.max(0, yMin), yMax);
  const x0 = Math.min(Math.max(0, xMin), xMax);
  axes += `<line x1="${sx(xMin)}" y1="${sy(y0)}" x2="${sx(xMax)}" y2="${sy(y0)}"/>`;
  axes += `<line x1="${sx(x0)}" y1="${sy(yMin)}" x2="${sx(x0)}" y2="${sy(yMax)}"/>`;
  const label = (v: number) => String(round(v)).replace("-", "−");
  for (let i = Math.ceil(xMin / step - 1e-9); i * step <= xMax + 1e-9; i++) {
    if (i === 0 || i % every !== 0) continue;
    numbers += `<text x="${sx(i * step)}" y="${sy(y0) + 13}">${label(i * step)}</text>`;
  }
  for (let i = Math.ceil(yMin / step - 1e-9); i * step <= yMax + 1e-9; i++) {
    if (i === 0 || i % every !== 0) continue;
    numbers += `<text x="${sx(x0) - 5}" y="${sy(i * step) + 3.5}" text-anchor="end">${label(i * step)}</text>`;
  }
  numbers += `<text x="${sx(xMax) + 10}" y="${sy(y0) + 4}" font-size="12" font-style="italic">x</text>`;
  numbers += `<text x="${sx(x0)}" y="${sy(yMax) - 8}" font-size="12" font-style="italic">y</text>`;
  numbers += "</g>";

  let regions = "";
  let body = "";
  let dots = "";
  const corners: Point[] = [
    [xMin, yMin],
    [xMax, yMin],
    [xMax, yMax],
    [xMin, yMax],
  ];
  for (const m of marks) {
    switch (m.kind) {
      case "region": {
        const poly = m.halfPlanes.reduce<Point[]>((acc, hp) => clipPolygon(acc, hp), corners);
        if (poly.length >= 3)
          regions += `<polygon class="accent" points="${poly.map((p) => `${sx(p[0])},${sy(p[1])}`).join(" ")}" fill="currentColor" fill-opacity="0.15" stroke="none"/>`;
        break;
      }
      case "curve": {
        const lo = Math.max(m.from ?? xMin, xMin);
        const hi = Math.min(m.to ?? xMax, xMax);
        const n = 240;
        let run: Point[] = [];
        const flush = () => {
          if (run.length >= 2) body += polyline(run, m);
          run = [];
        };
        let prev: Point | undefined;
        for (let i = 0; i <= n; i++) {
          const x = lo + ((hi - lo) * i) / n;
          const y = m.f(x);
          const cur: Point | undefined = Number.isFinite(y) ? [x, y] : undefined;
          if (prev && cur) {
            const seg = clipSegment(prev, cur, view);
            if (seg) {
              if (run.length === 0) run.push(seg[0]);
              run.push(seg[1]);
              if (seg[1][0] !== cur[0] || seg[1][1] !== cur[1]) flush();
            } else flush();
          } else flush();
          prev = cur;
        }
        flush();
        break;
      }
      case "line": {
        const [dx, dy] = [m.b[0] - m.a[0], m.b[1] - m.a[1]];
        const far = 4 * (xMax - xMin + yMax - yMin);
        const n = Math.hypot(dx, dy) || 1;
        const p: Point = [m.a[0] - (dx / n) * far, m.a[1] - (dy / n) * far];
        const q: Point = [m.a[0] + (dx / n) * far, m.a[1] + (dy / n) * far];
        const seg = clipSegment(p, q, view);
        if (seg) body += polyline(seg, m);
        break;
      }
      case "segment": {
        const seg = clipSegment(m.a, m.b, view);
        if (seg) body += polyline(seg, m);
        break;
      }
      case "point": {
        const fill = m.open ? 'fill="none"' : 'fill="currentColor"';
        dots += `<circle cx="${sx(m.at[0])}" cy="${sy(m.at[1])}" r="3.5" ${fill}${m.accent ? ' class="accent"' : ""} stroke-width="1.5"/>`;
        if (m.label) {
          const u = offsets[m.dir ?? "ne"];
          const d = 9 + Math.abs(u[0]) * 3.2 * m.label.length;
          dots += `<text x="${round(sx(m.at[0]) + u[0] * d)}" y="${round(sy(m.at[1]) + u[1] * d + 4)}" stroke="none" fill="currentColor">${m.label}</text>`;
        }
        break;
      }
      case "label": {
        const u = offsets[m.dir];
        const d = 9 + Math.abs(u[0]) * 3.2 * m.text.length;
        dots += `<text x="${round(sx(m.at[0]) + u[0] * d)}" y="${round(sy(m.at[1]) + u[1] * d + 4)}" stroke="none" fill="currentColor">${m.text}</text>`;
        break;
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(w + 10)} ${h}" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" font-size="12" text-anchor="middle">${grid}${regions}${axes}${numbers}${body}${dots}</svg>`;
}
