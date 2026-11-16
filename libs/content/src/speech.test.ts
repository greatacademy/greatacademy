import { describe, expect, it } from "vitest";

import { type Heard, heardInOrder, heardResponse, parseHeard, speechChecker, spokenWords, wordsPerMinute } from "./speech.ts";

const heard = (text: string, more: Partial<Heard> = {}) => heardResponse({ text, confidence: 0.9, seconds: 2, ...more });

describe("spokenWords", () => {
  it("says contractions in full, numbers in words, and drops punctuation", () => {
    expect(spokenWords("I'm 7, and I can't swim!")).toEqual(["i", "am", "seven", "and", "i", "cannot", "swim"]);
    expect(spokenWords("She doesn’t like well-known songs.")).toEqual(["she", "does", "not", "like", "well", "known", "songs"]);
  });

  it("counts the words of a reference heard in order", () => {
    expect(heardInOrder(["the", "cat", "sat"], ["the", "big", "cat", "sat"])).toBe(3);
    expect(heardInOrder(["the", "cat", "sat"], ["sat", "the", "cat"])).toBe(2);
  });
});

describe("speechChecker", () => {
  const repeat = { mode: "repeat", reference: "sheep" };

  it("accepts a word heard, and rejects another word with what was heard", () => {
    expect(speechChecker.check(repeat, heard("Sheep.")).correct).toBe(true);
    const wrong = speechChecker.check(repeat, heard("Ship."));
    expect(wrong.correct).toBe(false);
    expect(wrong.feedback?.en).toContain("Ship.");
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
