// Graphs in the coordinate plane, following the figure rules of
// docs/content.md §4. SVG clip paths are not allowed in figures, so every
// curve, line and region is clipped to the view here.

import type { PlotGrid } from "@ga/content";

import { type Compass, type Point, type Tone, toneClass } from "./figures.ts";

/** PlaneView is the visible window of the coordinate plane, with grid lines every step and numbers every labelEvery grid lines. */
export interface PlaneView {
  readonly xMin: number;
  readonly xMax: number;
  readonly yMin: number;
  readonly yMax: number;
  readonly step?: number;
  readonly labelEvery?: number;
  /** xName names the horizontal axis, x by default. */
  readonly xName?: string;
  /** yName names the vertical axis, y by default. */
  readonly yName?: string;
}

/** HalfPlane [a, b, c] is the set of points with a·x + b·y + c ≥ 0. */
export type HalfPlane = readonly [number, number, number];

/** Disk is the inside of the circle with center and radius r, or its outside when outside is set. */
export interface Disk {
  readonly center: Point;
  readonly r: number;
  readonly outside?: boolean;
}

/** PlaneMark is one element of a graph in the coordinate plane. */
export type PlaneMark =
  /** curve draws y = f(x) for x from from to to (the whole view by default), broken where it leaves the view or f is not finite. */
  | {
      readonly kind: "curve";
      readonly f: (x: number) => number;
      readonly from?: number;
      readonly to?: number;
      readonly accent?: boolean;
      readonly tone?: Tone;
      readonly dashed?: boolean;
    }
  /** line draws the whole line through a and b. */
  | {
      readonly kind: "line";
      readonly a: Point;
      readonly b: Point;
      readonly accent?: boolean;
      readonly tone?: Tone;
      readonly dashed?: boolean;
    }
  | {
      readonly kind: "segment";
      readonly a: Point;
      readonly b: Point;
      readonly accent?: boolean;
      readonly tone?: Tone;
      readonly dashed?: boolean;
    }
  /** point draws a dot, hollow when open, with an optional label. */
  | {
      readonly kind: "point";
      readonly at: Point;
      readonly open?: boolean;
      readonly label?: string;
      readonly dir?: Compass;
      readonly accent?: boolean;
      readonly tone?: Tone;
    }
  /** circle draws the circle with center and radius r. */
  | {
      readonly kind: "circle";
      readonly center: Point;
      readonly r: number;
      readonly accent?: boolean;
      readonly tone?: Tone;
      readonly dashed?: boolean;
    }
  /** region shades the part of the view where every half-plane holds, and inside or outside the disk if one is given. */
  | { readonly kind: "region"; readonly halfPlanes: readonly HalfPlane[]; readonly disk?: Disk }
  | { readonly kind: "label"; readonly at: Point; readonly text: string; readonly dir: Compass }
  /** arrow draws a straight arrow from from to to, left out when either end is outside the view. */
  | {
      readonly kind: "arrow";
      readonly from: Point;
      readonly to: Point;
      readonly accent?: boolean;
      readonly tone?: Tone;
      readonly thin?: boolean;
    }
  /** turn draws the arc with an arrowhead that from sweeps out when it turns by degrees about center, counterclockwise when degrees is positive; left out when it leaves the view. */
  | { readonly kind: "turn"; readonly center: Point; readonly from: Point; readonly degrees: number; readonly tone?: Tone }
  /** contour draws the level curve f(x, y) = level over the view. */
  | {
      readonly kind: "contour";
      readonly f: (x: number, y: number) => number;
      readonly level: number;
      readonly accent?: boolean;
      readonly dashed?: boolean;
    }
  /** path draws a closed or open chain of points, broken where it leaves the view. */
  | { readonly kind: "path"; readonly points: readonly Point[]; readonly accent?: boolean; readonly tone?: Tone; readonly dashed?: boolean }
  /** polygon shades a polygon, which need not be convex and has to lie inside the view. */
  | { readonly kind: "polygon"; readonly points: readonly Point[]; readonly tone?: Tone };

const size = 260;
const pad = 22;

/** planeGrid gives where a view's coordinates lie in its drawing, so that points can be marked on it; step is the distance between such points, one by default. */
export function planeGrid(view: PlaneView, step = 1): PlotGrid {
  const { xMin, xMax, yMin, yMax } = view;
  return { xMin, xMax, yMin, yMax, step, left: pad, top: pad, scale: Math.min(size / (xMax - xMin), size / (yMax - yMin)) };
}
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

/** circlePoints approximates the circle with center c and radius r by a counterclockwise polygon. */
function circlePoints([cx, cy]: Point, r: number, n = 144): Point[] {
  return Array.from({ length: n }, (_, i): Point => [cx + r * Math.cos((2 * Math.PI * i) / n), cy + r * Math.sin((2 * Math.PI * i) / n)]);
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
 * contourSegments finds the level curve f = level over the view by marching squares, as short segments. A cell with
 * the value on each side of one diagonal holds two segments, joined so as to keep the cell's center with its own side.
 */
function contourSegments(f: (x: number, y: number) => number, level: number, v: PlaneView, n = 90): [Point, Point][] {
  const out: [Point, Point][] = [];
  const [dx, dy] = [(v.xMax - v.xMin) / n, (v.yMax - v.yMin) / n];
  const value = (x: number, y: number) => f(x, y) - level;
  const cross = (p: Point, fp: number, q: Point, fq: number): Point => {
    const t = fp / (fp - fq);
    return [p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])];
  };
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const corners: Point[] = [
        [v.xMin + i * dx, v.yMin + j * dy],
        [v.xMin + (i + 1) * dx, v.yMin + j * dy],
        [v.xMin + (i + 1) * dx, v.yMin + (j + 1) * dy],
        [v.xMin + i * dx, v.yMin + (j + 1) * dy],
      ];
      // A tiny shift keeps a level that falls exactly on a grid point from counting as a crossing of two edges at once.
      const values = corners.map((c) => value(c[0], c[1]) || 1e-12);
      const hits: Point[] = [];
      for (let k = 0; k < 4; k++) {
        const [fp, fq] = [values[k]!, values[(k + 1) % 4]!];
        if (fp > 0 !== fq > 0) hits.push(cross(corners[k]!, fp, corners[(k + 1) % 4]!, fq));
      }
      if (hits.length === 2) out.push([hits[0]!, hits[1]!]);
      else if (hits.length === 4) {
        const centerAbove = value(v.xMin + (i + 0.5) * dx, v.yMin + (j + 0.5) * dy) > 0;
        const firstAbove = values[1]! > 0;
        if (centerAbove === firstAbove) out.push([hits[0]!, hits[3]!], [hits[1]!, hits[2]!]);
        else out.push([hits[0]!, hits[1]!], [hits[2]!, hits[3]!]);
      }
    }
  }
  return out;
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
  const attrs = (m: { accent?: boolean; tone?: Tone; dashed?: boolean }) => `${toneClass(m)}${m.dashed ? ' stroke-dasharray="6 4"' : ""}`;
  const polyline = (pts: readonly Point[], m: { accent?: boolean; tone?: Tone; dashed?: boolean }) =>
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
  numbers += `<text x="${sx(xMax) + 10}" y="${sy(y0) + 4}" font-size="12" font-style="italic">${view.xName ?? "x"}</text>`;
  numbers += `<text x="${sx(x0)}" y="${sy(yMax) - 8}" font-size="12" font-style="italic">${view.yName ?? "y"}</text>`;
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
  const edges: HalfPlane[] = [
    [1, 0, -xMin],
    [-1, 0, xMax],
    [0, 1, -yMin],
    [0, -1, yMax],
  ];
  for (const m of marks) {
    switch (m.kind) {
      case "region": {
        const clip = (start: readonly Point[]) =>
          [...m.halfPlanes, ...edges].reduce<Point[]>((acc, hp) => clipPolygon(acc, hp), [...start]);
        const pts = (poly: readonly Point[], sep: string) => poly.map((p) => `${sx(p[0])},${sy(p[1])}`).join(sep);
        const disk = m.disk && clip(circlePoints(m.disk.center, m.disk.r));
        const outer = m.disk && !m.disk.outside ? (disk ?? []) : clip(corners);
        if (outer.length < 3) break;
        if (m.disk?.outside && disk && disk.length >= 3) {
          // Outside a disk is the half-plane region with the disk cut out as an even-odd hole.
          regions += `<path class="accent" d="M${pts(outer, "L")}ZM${pts(disk, "L")}Z" fill="currentColor" fill-opacity="0.15" fill-rule="evenodd" stroke="none"/>`;
        } else {
          regions += `<polygon class="accent" points="${pts(outer, " ")}" fill="currentColor" fill-opacity="0.15" stroke="none"/>`;
        }
        break;
      }
      case "circle": {
        const pts = circlePoints(m.center, m.r);
        let run: Point[] = [];
        const flush = () => {
          if (run.length >= 2) body += polyline(run, m);
          run = [];
        };
        for (let i = 0; i < pts.length; i++) {
          const seg = clipSegment(pts[i]!, pts[(i + 1) % pts.length]!, view);
          if (!seg) {
            flush();
            continue;
          }
          const q = pts[(i + 1) % pts.length]!;
          if (run.length === 0) run.push(seg[0]);
          run.push(seg[1]);
          if (Math.hypot(seg[1][0] - q[0], seg[1][1] - q[1]) > 1e-9) flush();
        }
        flush();
        break;
      }
      case "arrow": {
        const inView = (p: Point) => p[0] >= xMin && p[0] <= xMax && p[1] >= yMin && p[1] <= yMax;
        if (!inView(m.from) || !inView(m.to)) break;
        const [x1, y1, x2, y2] = [sx(m.from[0]), sy(m.from[1]), sx(m.to[0]), sy(m.to[1])];
        const length = Math.hypot(x2 - x1, y2 - y1);
        if (length < 1e-6) break;
        const width = m.thin ? 1.2 : 2;
        const head = Math.min(m.thin ? 5 : 8, length * 0.6);
        const [ux, uy] = [(x2 - x1) / length, (y2 - y1) / length];
        const barb = (side: number) =>
          `${round(x2 - head * ux + side * head * 0.5 * uy)},${round(y2 - head * uy - side * head * 0.5 * ux)}`;
        const cls = toneClass(m);
        body += `<g${cls} stroke-width="${width}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><polyline points="${barb(1)} ${x2},${y2} ${barb(-1)}"/></g>`;
        break;
      }
      case "turn": {
        const [r0, a0] = [
          Math.hypot(m.from[0] - m.center[0], m.from[1] - m.center[1]),
          Math.atan2(m.from[1] - m.center[1], m.from[0] - m.center[0]),
        ];
        const n = Math.max(2, Math.ceil(Math.abs(m.degrees) / 3));
        const at = (i: number): Point => {
          const a = a0 + ((m.degrees * Math.PI) / 180) * (i / n);
          return [m.center[0] + r0 * Math.cos(a), m.center[1] + r0 * Math.sin(a)];
        };
        const arc = Array.from({ length: n + 1 }, (_, i) => at(i));
        if (arc.some((p) => p[0] < xMin || p[0] > xMax || p[1] < yMin || p[1] > yMax)) break;
        const [tip, before] = [arc[n]!, arc[n - 1]!];
        const [x2, y2, x1, y1] = [sx(tip[0]), sy(tip[1]), sx(before[0]), sy(before[1])];
        const length = Math.hypot(x2 - x1, y2 - y1) || 1;
        const [ux, uy] = [(x2 - x1) / length, (y2 - y1) / length];
        const barb = (side: number) => `${round(x2 - 8 * ux + side * 4 * uy)},${round(y2 - 8 * uy - side * 4 * ux)}`;
        body += `<g${toneClass(m)} stroke-width="2"><polyline points="${arc.map((p) => `${sx(p[0])},${sy(p[1])}`).join(" ")}"/><polyline points="${barb(1)} ${x2},${y2} ${barb(-1)}"/></g>`;
        break;
      }
      case "contour": {
        const d = contourSegments(m.f, m.level, view)
          .map(([p, q]) => `M${sx(p[0])} ${sy(p[1])}L${sx(q[0])} ${sy(q[1])}`)
          .join("");
        if (d) body += `<path d="${d}"${attrs(m)} stroke-width="1.6"/>`;
        break;
      }
      case "path": {
        let run: Point[] = [];
        const flush = () => {
          if (run.length >= 2) body += polyline(run, m);
          run = [];
        };
        for (let i = 0; i + 1 < m.points.length; i++) {
          const q = m.points[i + 1]!;
          const seg = clipSegment(m.points[i]!, q, view);
          if (!seg) {
            flush();
            continue;
          }
          if (run.length === 0) run.push(seg[0]);
          run.push(seg[1]);
          if (Math.hypot(seg[1][0] - q[0], seg[1][1] - q[1]) > 1e-9) flush();
        }
        flush();
        break;
      }
      case "polygon":
        regions += `<polygon${toneClass({ accent: true, ...(m.tone && { tone: m.tone }) })} points="${m.points.map((p) => `${sx(p[0])},${sy(p[1])}`).join(" ")}" fill="currentColor" fill-opacity="0.15" stroke="none"/>`;
        break;
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
        dots += `<circle cx="${sx(m.at[0])}" cy="${sy(m.at[1])}" r="3.5" ${fill}${toneClass(m)} stroke-width="1.5"/>`;
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
