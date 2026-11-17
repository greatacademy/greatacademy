import { describe, expect, it } from "vitest";

import { wordCount, writingChecker } from "./checkers.ts";

describe("wordCount", () => {
  it("counts words between spaces and each Chinese character", () => {
    expect(wordCount("The bees make honey.")).toBe(4);
    expect(wordCount("蜜蜂酿蜜。")).toBe(4);
    expect(wordCount("我学 English 三年了")).toBe(6);
  });

  it("lets a writing task in Chinese ask for characters", () => {
    expect(writingChecker.check({ minWords: 5, maxChars: 50 }, "春天来了。").correct).toBe(false);
    expect(writingChecker.check({ minWords: 5, maxChars: 50 }, "春天终于来了。").correct).toBe(true);
  });
});
