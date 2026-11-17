// Judging a character written by hand (docs/chinese-development-plan.md C3.3). The standard form of a character is the
// median of each of its strokes in the standard order: the line along its middle from where the brush lands to where
// it lifts, in the pad's box. A drawing is first moved and scaled as a whole onto the standard form, since a child may
// write small or off centre; then each stroke is compared with the stroke of the standard order at its place. The first
// stroke that goes wrong is named, with how: written the wrong way, out of order, or in the wrong shape or place.

import { type Checker, type Json, MAX_STROKES_LENGTH, parseStrokes, STROKE_BOX, type Stroke, t } from "@ga/content";

/** StrokesExpected is the data of the strokes checker: the medians of the strokes of a character, in order. */
export interface StrokesExpected {
  readonly medians: readonly Stroke[];
}

/** SAMPLES is how many points along a stroke are compared. */
const SAMPLES = 16;

/** TOLERANCE is how far, on average, a stroke may stray from its median, as a share of the pad's side. */
export const TOLERANCE = 0.11;

/** END_TOLERANCE is how far the ends of a stroke may be from those of its median, as a share of the pad's side. */
const END_TOLERANCE = 0.2;

type P = readonly [number, number];

const dist = (a: P, b: P) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** resample places SAMPLES points evenly along a path by its length; a path of one point stays at it. */
export function resample(stroke: Stroke, n = SAMPLES): readonly P[] {
  const lengths = [0];
  for (let i = 1; i < stroke.length; i++) lengths.push(lengths[i - 1]! + dist(stroke[i - 1]!, stroke[i]!));
  const total = lengths.at(-1)!;
  if (total === 0) return Array.from({ length: n }, () => stroke[0]!);
  let j = 0;
  return Array.from({ length: n }, (_, k) => {
    const at = (k * total) / (n - 1);
    while (j < stroke.length - 2 && lengths[j + 1]! < at) j++;
    const span = lengths[j + 1]! - lengths[j]!;
    const f = span === 0 ? 0 : Math.min(1, (at - lengths[j]!) / span);
    const a = stroke[j]!;
    const b = stroke[j + 1]!;
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f] as const;
  });
}

/** Frame is where a set of strokes lies: its centre and its size, the longer side of the box around it. */
interface Frame {
  readonly cx: number;
  readonly cy: number;
  readonly size: number;
}

function frame(strokes: readonly Stroke[]): Frame {
  const pts = strokes.flat();
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, size: Math.max(x1 - x0, y1 - y0) };
}

/**
 * align moves and scales a drawing as a whole so that the box around it falls on the box around the standard form. The
 * scale stays between a half and twice, so that a scribble is not blown up into a match.
 */
export function align(drawn: readonly Stroke[], medians: readonly Stroke[]): readonly Stroke[] {
  const from = frame(drawn);
  const to = frame(medians);
  const scale = from.size < STROKE_BOX / 50 || to.size === 0 ? 1 : Math.min(2, Math.max(0.5, to.size / from.size));
  return drawn.map((s) => s.map(([x, y]) => [to.cx + (x - from.cx) * scale, to.cy + (y - from.cy) * scale] as const));
}

/** strayed is how far a stroke strays from a median, as a share of the pad's side: the mean distance of their samples. */
export function strayed(stroke: Stroke, median: Stroke): number {
  const a = resample(stroke);
  const b = resample(median);
  return a.reduce((sum, p, i) => sum + dist(p, b[i]!), 0) / a.length / STROKE_BOX;
}

/** fits tells whether a stroke is the median drawn: near it all along, and its ends near the median's. */
function fits(stroke: Stroke, median: Stroke): boolean {
  return (
    strayed(stroke, median) <= TOLERANCE &&
    dist(stroke[0]!, median[0]!) / STROKE_BOX <= END_TOLERANCE &&
    dist(stroke.at(-1)!, median.at(-1)!) / STROKE_BOX <= END_TOLERANCE
  );
}

const reversed = (s: Stroke): Stroke => [...s].reverse();

/** medians reads the expected data of the strokes checker. */
function medians(expected: Json): readonly Stroke[] {
  const m = (expected as unknown as StrokesExpected).medians;
  if (!Array.isArray(m) || m.length === 0) throw new Error("strokes: no medians");
  return m;
}

/** StrokeFault is the first thing wrong with a drawing, if any: the stroke at fault, counted from 1, and how. */
export type StrokeFault =
  | { readonly kind: "count"; readonly drawn: number; readonly needed: number }
  | { readonly kind: "direction"; readonly stroke: number }
  | { readonly kind: "order"; readonly stroke: number; readonly standard: number }
  | { readonly kind: "shape"; readonly stroke: number };

/** strokeFault finds the first thing wrong with strokes drawn against the medians of a character, or undefined. */
export function strokeFault(drawn: readonly Stroke[], standard: readonly Stroke[]): StrokeFault | undefined {
  if (drawn.length !== standard.length) return { kind: "count", drawn: drawn.length, needed: standard.length };
  const placed = align(drawn, standard);
  for (let i = 0; i < placed.length; i++) {
    const s = placed[i]!;
    if (fits(s, standard[i]!)) continue;
    if (fits(reversed(s), standard[i]!)) return { kind: "direction", stroke: i + 1 };
    const other = standard.findIndex((m, j) => j !== i && fits(s, m));
    if (other >= 0) return { kind: "order", stroke: i + 1, standard: other + 1 };
    return { kind: "shape", stroke: i + 1 };
  }
  return undefined;
}

/** faultFeedback says what is wrong with a drawing, in words a child can follow. */
export function faultFeedback(f: StrokeFault) {
  switch (f.kind) {
    case "count":
      return t(`This character has ${f.needed} strokes; you wrote ${f.drawn}.`, `这个字有 ${f.needed} 笔，你写了 ${f.drawn} 笔。`);
    case "direction":
      return t(`Stroke ${f.stroke} goes the other way.`, `第 ${f.stroke} 笔的方向写反了。`);
    case "order":
      return t(
        `Stroke ${f.stroke} is stroke ${f.standard} of the standard order: check the order of the strokes.`,
        `你写的第 ${f.stroke} 笔应该是第 ${f.standard} 笔，注意笔顺。`,
      );
    case "shape":
      return t(`Check the shape and place of stroke ${f.stroke}.`, `注意第 ${f.stroke} 笔的形状和位置。`);
  }
}

/** strokesChecker accepts a character written stroke by stroke in the standard order; expected is StrokesExpected. */
export const strokesChecker: Checker = {
  id: "strokes",
  maxLength: MAX_STROKES_LENGTH,
  check(expected, response) {
    const drawn = parseStrokes(response);
    if (!drawn) return { correct: false };
    const fault = strokeFault(drawn, medians(expected));
    return fault ? { correct: false, feedback: faultFeedback(fault) } : { correct: true };
  },
  same(expected, response, mistake) {
    const standard = medians(expected);
    const a = parseStrokes(response);
    const b = parseStrokes(mistake);
    if (!a || !b) return false;
    const fa = strokeFault(a, standard);
    const fb = strokeFault(b, standard);
    return fa !== undefined && fb !== undefined && JSON.stringify(fa) === JSON.stringify(fb);
  },
};
