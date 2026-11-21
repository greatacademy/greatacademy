import { createRng, same, t } from "@ga/content";
import { describe, expect, test } from "vitest";

import { PINYIN_HINT, typed, typedGenerator } from "./kit.ts";

describe("typedGenerator", () => {
  const why = (answer: string) => same(answer);
  const bank = [typed("绿色", "lǜ sè", ["lù sè"])];

  test("says under a pinyin field how tones are typed", () => {
    const problem = typedGenerator("pinyin", t("Write the pinyin.", "写出拼音。"), bank, why)(createRng(1));
    expect(problem.answer.input).toEqual({ kind: "text", hint: PINYIN_HINT });
  });

  test("leaves a field of characters without a hint", () => {
    const problem = typedGenerator("hanzi", t("Write the characters.", "写出汉字。"), bank, why)(createRng(1));
    expect(problem.answer.input).toEqual({ kind: "text" });
  });
});
