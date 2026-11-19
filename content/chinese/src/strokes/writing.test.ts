import { createRng, type Stroke } from "@ga/content";
import { strokeFault } from "@ga/subject-chinese";
import { describe, expect, it } from "vitest";

import { HAND_BATCH, handwritingByGrade, handwritingTopics, medians, WRITTEN_BY_GRADE } from "./writing.ts";

describe("writing characters", () => {
  it("writes the curriculum's number of characters by grade 9, ten a batch", () => {
    const written = handwritingByGrade.flatMap((g) => g.batches.flatMap((b) => b.entries.map((e) => e.char)));
    expect(written.length).toBe(WRITTEN_BY_GRADE.at(-1));
    expect(new Set(written).size).toBe(written.length);
    expect(handwritingTopics.length * HAND_BATCH).toBe(written.length);
    expect(written.filter((c) => !medians.has(c))).toEqual([]);
    expect(handwritingByGrade.map((g) => g.batches.length * HAND_BATCH)).toEqual(
      WRITTEN_BY_GRADE.map((n, i) => n - (i === 0 ? 0 : WRITTEN_BY_GRADE[i - 1]!)),
    );
  });

  it("accepts the medians drawn small, off centre and shaky, and catches two strokes written in each other's place", () => {
    const rng = createRng(7);
    // gauss is about normal, of mean 0 and deviation 1.
    const gauss = () => (Array.from({ length: 6 }, () => rng.next()).reduce((a, b) => a + b) - 3) / Math.SQRT1_2;
    const clamp = (v: number) => Math.min(1024, Math.max(0, v));
    const chars = [...medians.keys()].filter((_, i) => i % 5 === 0);
    let accepted = 0;
    let caught = 0;
    let swapped = 0;
    for (const c of chars) {
      const standard = medians.get(c)!;
      const k = 0.5 + rng.next() * 0.4;
      const [dx, dy] = [100 + rng.next() * 200, 100 + rng.next() * 200];
      const drawn: Stroke[] = standard.map((s) =>
        s.map(([x, y]) => [clamp(x * k + dx + gauss() * 20 * k), clamp(y * k + dy + gauss() * 20 * k)]),
      );
      if (!strokeFault(drawn, standard)) accepted++;
      if (standard.length < 2) continue;
      const i = Math.floor(rng.next() * (standard.length - 1));
      [drawn[i], drawn[i + 1]] = [drawn[i + 1]!, drawn[i]!];
      swapped++;
      if (strokeFault(drawn, standard)) caught++;
    }
    expect(accepted / chars.length).toBeGreaterThanOrEqual(0.98);
    expect(caught / swapped).toBeGreaterThanOrEqual(0.95);
  });
});
