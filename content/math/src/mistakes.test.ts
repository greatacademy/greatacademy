import { topicSource } from "@ga/content";
import { mathCheckers } from "@ga/subject-math";
import { describe, expect, it } from "vitest";

import { math } from "./index.ts";

describe("feedback on a listed mistake", () => {
  const source = topicSource(math.topics, mathCheckers);
  const refs = Array.from({ length: 20 }, (_, seed) => ({ topic: "zero-product-rule", kp: 0, seed }));

  it("reaches the learner when judging a response", async () => {
    let seen = 0;
    for (const ref of refs) {
      const [problem] = await source.problems([ref]);
      for (const mistake of problem?.mistakes ?? []) {
        const { verdict } = await source.judge(ref, mistake.response);
        expect(verdict.correct).toBe(false);
        expect(verdict.feedback).toEqual(mistake.feedback);
        seen++;
      }
    }
    expect(seen).toBeGreaterThan(0);
  });

  it("leaves the correct answer without feedback", async () => {
    const ref = refs[0]!;
    const [problem] = await source.problems([ref]);
    const { verdict } = await source.judge(ref, problem!.canonical);
    expect(verdict.correct).toBe(true);
    expect(verdict.feedback).toBeUndefined();
  });
});
