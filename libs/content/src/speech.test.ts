import { describe, expect, it } from "vitest";

import { type Heard, heardInOrder, heardResponse, parseHeard, speechChecker, spokenWords, wordsPerMinute } from "./speech.ts";

const heard = (text: string, more: Partial<Heard> = {}) => heardResponse({ text, confidence: 0.9, seconds: 2, ...more });

describe("spokenWords", () => {
  it("says contractions in full, numbers in words, and drops punctuation", () => {
    expect(spokenWords("I'm 7, and I can't swim!")).toEqual(["i", "am", "seven", "and", "i", "cannot", "swim"]);
    expect(spokenWords("It's 15 or 25 minutes.")).toEqual(["it", "is", "fifteen", "or", "twenty", "five", "minutes"]);
    expect(spokenWords("twenty-five")).toEqual(["twenty", "five"]);
    expect(spokenWords("OK.")).toEqual(["okay"]);
    expect(spokenWords("She doesn’t like well-known songs.")).toEqual(["she", "does", "not", "like", "well", "known", "songs"]);
  });

  it("takes each Chinese character as a word of its own", () => {
    expect(spokenWords("我去商店，买书。")).toEqual(["我", "去", "商", "店", "买", "书"]);
  });

  it("counts the words of a reference heard in order", () => {
    expect(heardInOrder(["the", "cat", "sat"], ["the", "big", "cat", "sat"])).toBe(3);
    expect(heardInOrder(["the", "cat", "sat"], ["sat", "the", "cat"])).toBe(2);
  });
});

describe("speechChecker", () => {
  const repeat = { mode: "repeat", reference: "sheep" };

  it("names the parts of a Chinese syllable said wrong", () => {
    const said = heard("你好", {
      accuracy: 40,
      words: [
        { word: "你", accuracy: 90 },
        { word: "好", accuracy: 30, error: "mispronunciation", wrong: ["initial", "tone"] },
      ],
    });
    const wrong = speechChecker.check({ mode: "repeat", reference: "你好" }, said);
    expect(wrong.correct).toBe(false);
    expect(wrong.feedback?.["zh-CN"]).toBe("再听一遍，仔细模仿这些词：好（声母、声调）。");
    expect(wrong.feedback?.en).toBe("Listen again and copy these words closely: 好 (initial, tone).");
    expect(speechChecker.check({ mode: "repeat", reference: "你好" }, heard("你好。", { accuracy: 85 })).correct).toBe(true);
    expect(speechChecker.check({ mode: "repeat", reference: "我去商店买书" }, heard("我去商店卖书")).correct).toBe(true);
    expect(speechChecker.check({ mode: "repeat", reference: "我去商店买书" }, heard("我去书店")).correct).toBe(false);
  });

  it("accepts a word heard, and rejects another word naming the word to listen for", () => {
    expect(speechChecker.check(repeat, heard("Sheep.")).correct).toBe(true);
    const wrong = speechChecker.check(repeat, heard("Ship."));
    expect(wrong.correct).toBe(false);
    expect(wrong.feedback?.en).toBe("Listen again for: sheep.");
  });

  it("asks an accent only to be understood: accuracy at the bar passes", () => {
    expect(speechChecker.check(repeat, heard("sheep", { accuracy: 60 })).correct).toBe(true);
    const low = speechChecker.check(repeat, heard("sheep", { accuracy: 40, words: [{ word: "sheep", accuracy: 40 }] }));
    expect(low.correct).toBe(false);
    expect(low.feedback?.en).toContain("sheep");
  });

  it("lets a long text be read with a few words missed", () => {
    const read = { mode: "read", reference: "On Monday morning I walk to school with my little sister." };
    expect(speechChecker.check(read, heard("on monday morning i walk to school with my sister")).correct).toBe(true);
    expect(speechChecker.check(read, heard("on monday i go to school")).correct).toBe(false);
  });

  it("takes a sentence to say word for word, in either form of a contraction", () => {
    const say = { mode: "say", accept: ["I didn't go to school yesterday.", "I did not go to school yesterday."] };
    expect(speechChecker.check(say, heard("I didn't go to school yesterday")).correct).toBe(true);
    expect(speechChecker.check(say, heard("I did not go to school yesterday.")).correct).toBe(true);
    expect(speechChecker.check(say, heard("I don't go to school yesterday")).correct).toBe(false);
  });

  it("rejects what is not a heard response", () => {
    expect(speechChecker.check(repeat, "sheep").correct).toBe(false);
    expect(parseHeard('{"text":1}')).toBeUndefined();
  });

  it("measures words per minute of the reference", () => {
    expect(wordsPerMinute("one two three four", { text: "one two three four", confidence: 1, seconds: 2 })).toBe(120);
  });
});
