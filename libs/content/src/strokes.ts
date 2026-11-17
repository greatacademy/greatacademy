// Strokes drawn by hand on a square pad, the response to a strokes input: each stroke is the path of a finger or a pen
// from where it touched the pad to where it lifted, in a box of STROKE_BOX units a side with y pointing down. The
// response writes them as text, so that it is stored and checked as any other: the points of a stroke as "x,y" joined
// by spaces, the strokes joined by ";".

/** STROKE_BOX is the side of the square pad strokes are drawn in, in its own units. */
export const STROKE_BOX = 1024;

/** Point is a point of a stroke: x from the left of the pad, y from its top. */
export type Point = readonly [number, number];

/** Stroke is the points of one stroke in the order they were drawn. */
export type Stroke = readonly Point[];

/** MAX_STROKE_POINTS is how many points of a stroke a response keeps; clients thin longer paths to it. */
export const MAX_STROKE_POINTS = 48;

/** MAX_STROKES is how many strokes a response may have. */
export const MAX_STROKES = 40;

/** MAX_STROKES_LENGTH is the longest response of strokes: every stroke at its most points, each of nine characters. */
export const MAX_STROKES_LENGTH = MAX_STROKES * MAX_STROKE_POINTS * 10;

const POINT = /^(\d{1,4}),(\d{1,4})$/u;

/**
 * parseStrokes reads a response of strokes; it is undefined unless every point is two whole numbers in the box, every
 * stroke has a point and at most MAX_STROKE_POINTS, and there are at most MAX_STROKES.
 */
export function parseStrokes(response: string): readonly Stroke[] | undefined {
  const text = response.trim();
  if (text === "") return [];
  const strokes = text.split(";").map((s) =>
    s
      .trim()
      .split(/\s+/u)
      .map((p): Point | undefined => {
        const m = POINT.exec(p);
        if (!m) return undefined;
        const x = Number(m[1]);
        const y = Number(m[2]);
        return x <= STROKE_BOX && y <= STROKE_BOX ? [x, y] : undefined;
      }),
  );
  if (strokes.length > MAX_STROKES) return undefined;
  if (strokes.some((s) => s.length === 0 || s.length > MAX_STROKE_POINTS || s.some((p) => p === undefined))) return undefined;
  return strokes as readonly Stroke[];
}

/** formatStrokes writes strokes as a response, rounding each point to whole units inside the box. */
export function formatStrokes(strokes: readonly Stroke[]): string {
  const clamp = (v: number) => Math.min(STROKE_BOX, Math.max(0, Math.round(v)));
  return strokes.map((s) => s.map(([x, y]) => `${clamp(x)},${clamp(y)}`).join(" ")).join(";");
}

/** thinStroke keeps at most MAX_STROKE_POINTS points of a path, evenly along it, always its first and last. */
export function thinStroke(stroke: Stroke, most = MAX_STROKE_POINTS): Stroke {
  if (stroke.length <= most) return stroke;
  return Array.from({ length: most }, (_, i) => stroke[Math.round((i * (stroke.length - 1)) / (most - 1))]!);
}
