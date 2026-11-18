import { createRng } from "@ga/content";
import { describe, expect, it } from "vitest";

import { checkSentenceUnits, parseSentences, sentenceGenerator } from "./sentences.ts";

const TAUGHT = new Set([..."我你他是去不来家朋友和都"]);

/** thirty makes 30 distinct lines from a template, each with its own number of 我 at the start. */
const thirty = (line: (k: number) => string): string => Array.from({ length: 30 }, (_, k) => line(k)).join("\n");

describe("sentence building", () => {
  it("reads parts and further right orders", () => {
    const items = parseSentences(
      "test",
      thirty((k) => `${"我".repeat(k + 1)} / 和 / 朋友 / 都去。 | 2,1,0,3`),
      [3, 4],
      TAUGHT,
    );
    expect(items[0]).toEqual({ parts: ["我", "和", "朋友", "都去。"], alsoRight: [[2, 1, 0, 3]] });
  });

  it("rejects untaught characters, wrong part counts, missing end marks and orders that are not reorderings", () => {
    const one = (line: string) => () =>
      parseSentences(
        "test",
        thirty((k) => (k === 0 ? line : `${"我".repeat(k + 1)} / 是 / 朋友。`)),
        [3, 4],
        TAUGHT,
      );
    expect(one("我 / 是 / 客人。")).toThrow(/客人, not yet taught|客人/);
    expect(one("我 / 去。")).toThrow(/2 parts/);
    expect(one("我 / 是 / 朋友")).toThrow(/must end/);
    expect(one("我 / 和 / 朋友 / 都去。 | 0,1,1,3")).toThrow(/not a reordering/);
    expect(() => parseSentences("test", "我 / 是 / 朋友。", [3, 4], TAUGHT)).toThrow(/needs 30/);
  });

  it("never shows the parts in a right order and accepts every right order", () => {
    const bank = parseSentences(
      "test",
      thirty((k) => `${"我".repeat(k + 1)} / 和 / 朋友 / 都去。 | 2,1,0,3`),
      [3, 4],
      TAUGHT,
    );
    const generate = sentenceGenerator(bank);
    for (let seed = 1; seed <= 60; seed++) {
      const p = generate(createRng(seed));
      if (p.answer.input.kind !== "order") throw new Error("not an order");
      const shown = p.answer.input.items.map((x) => x.en);
      const expected = p.answer.expected as number[][];
      expect(expected).toHaveLength(2);
      for (const order of expected) expect(order.map((i) => shown[i]).join("")).toMatch(/^(我+和朋友|朋友和我+)都去。$/u);
      expect(expected.map((o) => o.join(","))).not.toContain(shown.map((_, i) => i).join(","));
      expect(p.wrong).toEqual([shown.map((_, i) => i).join(",")]);
    }
  });

  it("places topics only at the ends of units 3, 6, 9 and 12", () => {
    expect(() => checkSentenceUnits(1, [{ unit: 3, short: "", long: "" }])).not.toThrow();
    expect(() => checkSentenceUnits(1, [{ unit: 4, short: "", long: "" }])).toThrow(/3,6,9,12/);
  });
});
