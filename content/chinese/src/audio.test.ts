import { describe, expect, it } from "vitest";

import { textSsml } from "./audio.ts";

describe("textSsml", () => {
  it("says a word the voice misreads in its reading", () => {
    expect(textSsml("查重")).toContain('<phoneme alphabet="sapi" ph="cha 2 chong 2">查重</phoneme>');
    expect(textSsml("同行")).toContain('ph="tong 2 hang 2"');
  });

  it("marks such a word in a sentence only where its reading holds everywhere", () => {
    expect(textSsml("两位邻居因为一点小事发生了口角。")).toContain('ph="kou 3 jue 2">口角</phoneme>');
    expect(textSsml("我们一路同行。")).not.toContain("phoneme");
    expect(textSsml("门口有很多人在排长队。")).toContain('ph="pai 2 chang 2 dui 4"');
    expect(textSsml("他睡着了。")).not.toContain("phoneme");
  });

  it("leaves other lines as they are", () => {
    expect(textSsml("银行")).not.toContain("phoneme");
  });
});
