import { describe, expect, it } from "vitest";

import { hanziChecker, pinyinChecker } from "./checkers.ts";

describe("hanziChecker", () => {
  it("accepts the text whatever the width of its punctuation and its spacing", () => {
    expect(hanziChecker.check(["床前明月光，疑是地上霜。"], "床前明月光, 疑是地上霜。").correct).toBe(true);
    expect(hanziChecker.check(["你好吗？"], "你好吗?").correct).toBe(true);
    expect(hanziChecker.check(["春天"], " 春 天 ").correct).toBe(true);
  });

  it("rejects a wrong character", () => {
    expect(hanziChecker.check(["床前明月光，疑是地上霜。"], "床前明月光，疑是地上箱。")).toEqual({ correct: false });
  });

  it("tells a slip in punctuation from a wrong character", () => {
    const verdict = hanziChecker.check(["床前明月光，疑是地上霜。"], "床前明月光疑是地上霜");
    expect(verdict.correct).toBe(false);
    expect(verdict.feedback?.["zh-CN"]).toContain("标点");
  });

  it("knows a listed mistake however it is spaced", () => {
    expect(hanziChecker.same?.([], "地上 箱", "地上箱")).toBe(true);
  });
});

describe("pinyinChecker", () => {
  it("accepts marks or numbers", () => {
    expect(pinyinChecker.check(["lǜ"], "lv4").correct).toBe(true);
    expect(pinyinChecker.check(["zhōngguó"], "Zhong1 guo2").correct).toBe(true);
  });

  it("tells a wrong tone from a wrong syllable", () => {
    const tone = pinyinChecker.check(["mǎ"], "ma1");
    expect(tone.correct).toBe(false);
    expect(tone.feedback?.["zh-CN"]).toContain("声调");
    expect(pinyinChecker.check(["mǎ"], "mo3")).toEqual({ correct: false });
  });
});
