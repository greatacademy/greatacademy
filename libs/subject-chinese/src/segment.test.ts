import { describe, expect, it } from "vitest";

import { hanzi, segmenter } from "./segment.ts";

describe("segmenter", () => {
  const words = segmenter(["我", "们", "我们", "喜", "欢", "喜欢", "春", "天", "春天", "的", "花"]);

  it("takes the longest spelling first", () => {
    expect(words("我们喜欢春天的花。", [])).toEqual(["我们", "喜欢", "春天", "的", "花"]);
  });

  it("splits a character the lexicon lacks on its own", () => {
    expect(words("我们爱花", [])).toEqual(["我们", "爱", "花"]);
  });

  it("takes a passage's known words, and words in letters", () => {
    expect(words("小明喜欢 iPad 和花", ["小明"])).toEqual(["小明", "喜欢", "iPad", "和", "花"]);
  });

  it("counts characters", () => {
    expect(hanzi("春天，花开了。")).toEqual(["春", "天", "花", "开", "了"]);
  });
});
