import { describe, expect, it } from "vitest";

import { dialogueSsml } from "../audio.ts";
import { parseBlocks } from "./comprehension.ts";

describe("parseBlocks", () => {
  it("reads a dialogue and a passage with their questions", () => {
    const blocks = parseBlocks(
      "test",
      `
女：你去哪儿？
男：我去商店。
问：男的去哪儿？
答：商店
错：学校
错：医院

文：今天天气很好。
问：今天天气怎么样？
答：很好
错：不好
错：下雨
`,
    );
    expect(blocks).toHaveLength(2);
    expect(blocks[0]!.lines.map((l) => l.speaker)).toEqual(["a", "b"]);
    expect(blocks[0]!.talk).toBe(false);
    expect(blocks[0]!.questions[0]).toEqual({ ask: "男的去哪儿？", right: "商店", wrong: ["学校", "医院"] });
    expect(blocks[1]!.talk).toBe(true);
  });

  it("rejects a question with no right answer", () => {
    expect(() => parseBlocks("test", "女：你好。\n男：你好。\n问：谁？\n错：我")).toThrow();
  });
});

describe("dialogueSsml", () => {
  it("gives each speaker a voice and a pause between turns", () => {
    const ssml = dialogueSsml([
      { speaker: "a", text: "你好。" },
      { speaker: "b", text: "你好。" },
    ]);
    expect(ssml.match(/<voice /g)).toHaveLength(2);
    expect(ssml).toContain("<break");
  });
});
