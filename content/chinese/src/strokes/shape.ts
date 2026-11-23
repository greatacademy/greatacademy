// What the medians tell of a stroke (docs/chinese-curriculum.md §5.1). The stroke data holds the line along the middle of
// each stroke, not its type, so a stroke is read from its shape: a straight stroke is named by the way it goes (横 to the
// right, 竖 down, 撇 down to the left, 捺 down to the right, 提 up to the right, 点 a short one); a stroke that changes
// direction or ends in a hook is only said to turn, since the turning strokes (横折, 横撇, 横钩, 横撇弯钩…) cannot be
// told apart reliably from the line alone. A short stroke that may be a 点 or a short 撇 is not named.

import type { Stroke } from "@ga/content";

type Point = readonly [number, number];

/** simplified keeps the corners of a stroke: the points farther than eps from the line between their neighbours (Ramer–Douglas–Peucker). */
function simplified(points: readonly Point[], eps: number): readonly Point[] {
  if (points.length < 3) return points;
  const a = points[0]!;
  const b = points.at(-1)!;
  const span = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  let far = -1;
  let at = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i]!;
    const d = Math.abs((b[1] - a[1]) * p[0] - (b[0] - a[0]) * p[1] + b[0] * a[1] - b[1] * a[0]) / span;
    if (d > far) [far, at] = [d, i];
  }
  if (far <= eps) return [a, b];
  return [...simplified(points.slice(0, at + 1), eps).slice(0, -1), ...simplified(points.slice(at), eps)];
}

const angle = (v: Point): number => (Math.atan2(v[1], v[0]) * 180) / Math.PI;
const length = (v: Point): number => Math.hypot(v[0], v[1]);

/** Way is the way a run of a stroke goes, y running down: right, down, down-left, down-right, up-right, or left. */
type Way = "H" | "V" | "P" | "N" | "T" | "L";

/** wayOf is the way a vector goes. */
function wayOf(v: Point): Way {
  const a = angle(v);
  if (a > -25 && a <= 25) return "H";
  if (a > 25 && a <= 65) return "N";
  if (a > 65 && a <= 115) return "V";
  if (a > 115 && a <= 160) return "P";
  if (a > -85 && a <= -25) return "T";
  return "L";
}

/** StrokeShape is what the line of a stroke shows: a straight stroke by name, a turning stroke, or a stroke not told. */
export type StrokeShape = "横" | "竖" | "撇" | "捺" | "点" | "提" | "turning" | "unknown";

/** shapeOf reads a stroke from its median: its runs, after the small tick where the brush lands, and a hook at its end. */
export function shapeOf(stroke: Stroke): StrokeShape {
  const corners = simplified(stroke, 45);
  let runs: Point[] = [];
  for (let i = 1; i < corners.length; i++) runs.push([corners[i]![0] - corners[i - 1]![0], corners[i]![1] - corners[i - 1]![1]]);
  // The tick where the brush lands is not a part of the stroke.
  if (runs.length > 1 && length(runs[0]!) < 110) runs = runs.slice(1);
  // A short run back up at the end is a hook.
  const last = runs.at(-1);
  if (runs.length > 1 && last && length(last) < 240 && last[1] < -40) return "turning";
  // Runs that bend by less than 58° are one curved run.
  const groups: Point[][] = [];
  for (const run of runs) {
    const group = groups.at(-1);
    if (group) {
      let bend = Math.abs(angle(run) - angle(group.at(-1)!));
      if (bend > 180) bend = 360 - bend;
      if (bend < 58) {
        group.push(run);
        continue;
      }
    }
    groups.push([run]);
  }
  if (groups.length !== 1) return "turning";
  const whole = groups[0]!.reduce<Point>((s, v) => [s[0] + v[0], s[1] + v[1]], [0, 0]);
  const size = length(whole);
  const way = wayOf(whole);
  // How far the stroke drifts left from where it lands to where it ends: a 撇 that falls nearly straight, as in 月.
  const drift = stroke.at(-1)![0] - (corners.length > 2 && runs.length < corners.length - 1 ? corners[1]![0] : corners[0]![0]);
  switch (way) {
    case "H":
      return "横";
    case "T":
      return "提";
    case "L":
      return "撇";
    case "N":
      return size < 330 ? "点" : "捺";
    case "V":
      if (size < 250) return "unknown";
      return drift < -70 ? "撇" : "竖";
    case "P":
      return size < 250 ? "unknown" : "撇";
  }
}
