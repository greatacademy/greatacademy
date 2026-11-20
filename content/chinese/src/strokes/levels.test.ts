import { createRng } from "@ga/content";
import { describe, expect, it } from "vitest";
import { HAND_BATCH, medians } from "./hand.ts";
import { levelHandwritingByLevel, levelHandwritingTopics, WRITTEN_BY_LEVEL } from "./levels.ts";
import { handwritingTopics } from "./writing.ts";

describe("writing characters in the levels", () => {
  it("writes GF 0025-2021's number of characters by the end of each level, ten a batch", () => {
    expect(levelHandwritingByLevel.map((l) => l.level)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(levelHandwritingByLevel.map((l) => l.batches.length * HAND_BATCH)).toEqual(
      WRITTEN_BY_LEVEL.map((n, i) => n - (i === 0 ? 0 : WRITTEN_BY_LEVEL[i - 1]!)),
    );
    const written = levelHandwritingByLevel.flatMap((l) => l.batches.flatMap((b) => b.chars.map((c) => c.char)));
    expect(written.length).toBe(WRITTEN_BY_LEVEL.at(-1));
    expect(new Set(written).size).toBe(written.length);
  });

  it("has the medians of every character it writes", () => {
    const written = levelHandwritingByLevel.flatMap((l) => l.batches.flatMap((b) => b.chars.map((c) => c.char)));
    expect(written.filter((c) => !medians.has(c))).toEqual([]);
  });

  it("gives every topic and knowledge point its own id, apart from the native writing topics", () => {
    const ids = [...levelHandwritingTopics, ...handwritingTopics].map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    const points = levelHandwritingTopics.flatMap((x) => x.knowledgePoints.map((k) => k.id));
    expect(new Set(points).size).toBe(points.length);
    expect(levelHandwritingTopics[0]!.id).toBe("level-1-handwriting-01");
    expect(levelHandwritingTopics.at(-1)!.id).toBe("level-9-handwriting-17");
  });

  it("asks thirty different tasks, never the same character twice in a row", () => {
    for (const topic of levelHandwritingTopics) {
      for (const kp of topic.knowledgePoints) {
        const problems = Array.from({ length: 30 }, (_, s) => kp.generate(createRng(s)));
        expect(new Set(problems.map((p) => JSON.stringify(p.prompt))).size).toBe(30);
        for (let s = 1; s < 30; s++) expect(problems[s]!.canonical).not.toBe(problems[s - 1]!.canonical);
      }
    }
  });
});
