import { formatStrokes, type Stroke } from "@ga/content";
import { describe, expect, it } from "vitest";

import { align, resample, strayed, strokeFault, strokesChecker } from "./strokes.ts";

// Medians written for these tests, in the pad's box of 1024 with y down; not taken from any stroke data.
const SHI: readonly Stroke[] = [
  [
    [180, 500],
    [844, 500],
  ],
  [
    [512, 150],
    [512, 880],
  ],
];
const REN: readonly Stroke[] = [
  [
    [512, 160],
    [480, 450],
    [200, 860],
  ],
  [
    [500, 480],
    [700, 700],
    [860, 860],
  ],
];
const KOU: readonly Stroke[] = [
  [
    [260, 300],
    [260, 780],
  ],
  [
    [260, 300],
    [760, 300],
    [760, 780],
  ],
  [
    [260, 760],
    [760, 760],
  ],
];
const SAN: readonly Stroke[] = [
  [
    [300, 260],
    [720, 260],
  ],
  [
    [340, 500],
    [690, 500],
  ],
  [
    [200, 800],
    [830, 800],
  ],
];

/** wobble draws a median as a hand might: many points along it, moved, scaled and shaken by a fixed pattern. */
function wobble(strokes: readonly Stroke[], { dx = 0, dy = 0, scale = 1, shake = 0 } = {}): readonly Stroke[] {
  return strokes.map((s) =>
    resample(s, 20).map(
      ([x, y], i) =>
        [512 + (x - 512) * scale + dx + shake * Math.sin(i * 1.7), 512 + (y - 512) * scale + dy + shake * Math.cos(i * 2.3)] as const,
    ),
  );
}

const check = (medians: readonly Stroke[], drawn: readonly Stroke[]) =>
  strokesChecker.check({ medians: medians as never }, formatStrokes(drawn));

describe("strokes", () => {
  it("resamples a path evenly by its length", () => {
    const r = resample(
      [
        [0, 0],
        [100, 0],
        [100, 50],
      ],
      4,
    );
    expect(r).toEqual([
      [0, 0],
      [50, 0],
      [100, 0],
      [100, 50],
    ]);
    expect(resample([[5, 5]], 3)).toEqual([
      [5, 5],
      [5, 5],
      [5, 5],
    ]);
  });

  it("accepts the standard form, and a hand's drawing of it small, off centre and shaky", () => {
    for (const c of [SHI, REN, KOU, SAN]) {
      expect(check(c, c).correct).toBe(true);
      expect(check(c, wobble(c, { dx: -150, dy: 120, scale: 0.55, shake: 18 })).correct).toBe(true);
      expect(check(c, wobble(c, { scale: 1.1, shake: 30 })).correct).toBe(true);
    }
  });

  it("moves and scales the whole drawing onto the standard form", () => {
    const small = wobble(SHI, { dx: 200, dy: -200, scale: 0.5 });
    expect(strayed(align(small, SHI)[0]!, SHI[0]!)).toBeLessThan(0.01);
  });

  it("counts the strokes", () => {
    expect(strokeFault([SHI[0]!], SHI)).toEqual({ kind: "count", drawn: 1, needed: 2 });
    const split: readonly Stroke[] = [KOU[0]!, [KOU[1]![0]!, KOU[1]![1]!], [KOU[1]![1]!, KOU[1]![2]!], KOU[2]!];
    expect(check(KOU, split)).toEqual({
      correct: false,
      feedback: { en: "This character has 3 strokes; you wrote 4.", "zh-CN": "这个字有 3 笔，你写了 4 笔。" },
    });
  });

  it("names a stroke written the wrong way", () => {
    expect(strokeFault([SHI[0]!, [...SHI[1]!].reverse()], SHI)).toEqual({ kind: "direction", stroke: 2 });
    expect(check(SHI, [SHI[0]!, [...SHI[1]!].reverse()]).feedback?.["zh-CN"]).toBe("第 2 笔的方向写反了。");
  });

  it("names a stroke out of order", () => {
    expect(strokeFault([SHI[1]!, SHI[0]!], SHI)).toEqual({ kind: "order", stroke: 1, standard: 2 });
    expect(strokeFault([SAN[0]!, SAN[2]!, SAN[1]!], SAN)).toEqual({ kind: "order", stroke: 2, standard: 3 });
  });

  it("names a stroke of the wrong shape or place", () => {
    const flat: Stroke = [
      [500, 700],
      [860, 700],
    ];
    expect(strokeFault([REN[0]!, flat], REN)).toEqual({ kind: "shape", stroke: 2 });
    expect(check(REN, [REN[0]!, flat]).feedback?.en).toBe("Check the shape and place of stroke 2.");
  });

  it("treats two drawings as the same mistake when the same thing is wrong", () => {
    const e = { medians: SHI as never };
    const backward = formatStrokes([SHI[0]!, [...SHI[1]!].reverse()]);
    const shakyBackward = formatStrokes(wobble([SHI[0]!, [...SHI[1]!].reverse()], { shake: 15 }));
    expect(strokesChecker.same!(e, shakyBackward, backward)).toBe(true);
    expect(strokesChecker.same!(e, formatStrokes([SHI[1]!, SHI[0]!]), backward)).toBe(false);
    expect(strokesChecker.same!(e, formatStrokes(SHI), formatStrokes(SHI))).toBe(false);
  });

  it("rejects what is not strokes", () => {
    expect(strokesChecker.check({ medians: SHI as never }, "12,x").correct).toBe(false);
    expect(strokesChecker.check({ medians: SHI as never }, "").correct).toBe(false);
  });
});
