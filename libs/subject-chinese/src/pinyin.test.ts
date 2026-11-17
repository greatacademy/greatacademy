import { describe, expect, it } from "vitest";

import { pinyinKey, toneless, withMarks } from "./pinyin.ts";

describe("pinyin", () => {
  it("writes tone numbers as marks on the vowel that carries them", () => {
    expect(withMarks("zhong1guo2")).toBe("zhōngguó");
    expect(withMarks("lü4 se4")).toBe("lǜ sè");
    expect(withMarks("lv4")).toBe("lǜ");
    expect(withMarks("gou3 shui3 liu2")).toBe("gǒu shuǐ liú");
    expect(withMarks("ma5")).toBe("ma");
    expect(withMarks("Bei3jing1")).toBe("Běijīng");
  });

  it("gives one key to marks, numbers, spacing and case", () => {
    const key = pinyinKey("Zhōngguó");
    expect(pinyinKey("zhong1guo2")).toBe(key);
    expect(pinyinKey("zhong1 guo2")).toBe(key);
    expect(pinyinKey("ZHŌNG GUÓ")).toBe(key);
    expect(pinyinKey("nü3")).toBe(pinyinKey("nv3"));
    expect(pinyinKey("nü3")).toBe(pinyinKey("nǚ"));
    expect(pinyinKey("xi1'an1")).toBe(pinyinKey("xī'ān"));
    expect(pinyinKey("ma1ma5")).toBe(pinyinKey("māma"));
  });

  it("keeps tones apart", () => {
    expect(pinyinKey("mā")).not.toBe(pinyinKey("mǎ"));
    expect(toneless("mā")).toBe(toneless("ma3"));
  });
});
