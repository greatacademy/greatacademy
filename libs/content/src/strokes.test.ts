import { describe, expect, it } from "vitest";

import { formatStrokes, MAX_STROKE_POINTS, parseStrokes, thinStroke } from "./strokes.ts";

describe("parseStrokes", () => {
  it("reads strokes of points in the box", () => {
    expect(parseStrokes("0,0 100,20; 512,1024")).toEqual([
      [
        [0, 0],
        [100, 20],
      ],
      [[512, 1024]],
    ]);
    expect(parseStrokes("  ")).toEqual([]);
  });

  it("rejects points outside the box or not whole, and empty strokes", () => {
    expect(parseStrokes("0,0 1025,0")).toBeUndefined();
    expect(parseStrokes("0.5,0")).toBeUndefined();
    expect(parseStrokes("-1,0")).toBeUndefined();
    expect(parseStrokes("0,0;;1,1")).toBeUndefined();
    expect(parseStrokes("0,0 1,1 x")).toBeUndefined();
    expect(parseStrokes(Array.from({ length: MAX_STROKE_POINTS + 1 }, () => "1,1").join(" "))).toBeUndefined();
  });
});

describe("formatStrokes", () => {
  it("rounds into the box and reads back", () => {
    const text = formatStrokes([
      [
        [0.4, -3],
        [2000, 10.6],
      ],
      [[5, 5]],
    ]);
    expect(text).toBe("0,0 1024,11;5,5");
    expect(formatStrokes(parseStrokes(text)!)).toBe(text);
  });
});

describe("thinStroke", () => {
  it("keeps a short path, and thins a long one evenly from its first point to its last", () => {
    const path = Array.from({ length: 100 }, (_, i) => [i, 0] as const);
    expect(thinStroke(path.slice(0, 3))).toHaveLength(3);
    const thin = thinStroke(path, 5);
    expect(thin.map((p) => p[0])).toEqual([0, 25, 50, 74, 99]);
  });
});
