import { describe, expect, it } from "vitest";

import { pinyinKey, pinyinSpellings, spokenSyllables, toneless, withMarks } from "./pinyin.ts";

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

  it("marks 一 and 不 with the tone said", () => {
    expect(spokenSyllables("一心一意", ["yī", "xīn", "yī", "yì"])).toEqual(["yì", "xīn", "yí", "yì"]);
    expect(spokenSyllables("一个", ["yī", "ge"])).toEqual(["yí", "ge"]);
    expect(spokenSyllables("不客气", ["bù", "kè", "qi"])).toEqual(["bú", "kè", "qi"]);
    expect(spokenSyllables("不好", ["bù", "hǎo"])).toEqual(["bù", "hǎo"]);
    expect(spokenSyllables("对不起", ["duì", "bu", "qǐ"])).toEqual(["duì", "bu", "qǐ"]);
  });

  it("keeps 一 as a numeral and at the end of a word", () => {
    expect(spokenSyllables("第一", ["dì", "yī"])).toEqual(["dì", "yī"]);
    expect(spokenSyllables("一月", ["yī", "yuè"])).toEqual(["yī", "yuè"]);
    expect(spokenSyllables("十一", ["shí", "yī"])).toEqual(["shí", "yī"]);
    expect(spokenSyllables("统一", ["tǒng", "yī"])).toEqual(["tǒng", "yī"]);
    expect(spokenSyllables("一五一十", ["yī", "wǔ", "yī", "shí"])).toEqual(["yī", "wǔ", "yī", "shí"]);
  });

  it("accepts a typed word in the tone said and in its own tones", () => {
    expect(pinyinSpellings("一样", ["yī", "yàng"])).toEqual(["yíyàng", "yīyàng"]);
    expect(pinyinSpellings("一样", ["yí", "yàng"])).toEqual(["yíyàng", "yīyàng"]);
    expect(pinyinSpellings("中国", ["zhōng", "guó"])).toEqual(["zhōngguó"]);
  });
});
