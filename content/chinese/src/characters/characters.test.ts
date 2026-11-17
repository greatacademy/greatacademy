import { describe, expect, it } from "vitest";

import { gradesFiveAndSix, gradesThreeAndFour, tableOne, tableTwo } from "./common.ts";
import { characterLexicon, gradesFiveAndSixEntries, gradesThreeAndFourEntries, recognitionByGrade } from "./index.ts";
import { otherTones, parseCharacters } from "./recognition.ts";

describe("character lists", () => {
  it("hold the 3,500 common characters once each", () => {
    expect(tableOne).toHaveLength(2500);
    expect(tableTwo).toHaveLength(1000);
    expect(new Set([...tableOne, ...tableTwo]).size).toBe(3500);
  });

  it("teach grades 3 to 6 characters of the right tables", () => {
    expect(gradesThreeAndFour).toHaveLength(900);
    expect(gradesFiveAndSix).toHaveLength(500);
    const one = new Set(tableOne);
    const two = new Set(tableTwo);
    expect(gradesThreeAndFour.filter((c) => !one.has(c))).toEqual([]);
    expect(gradesFiveAndSix.filter((c) => !two.has(c))).toEqual([]);
    expect(new Set(gradesThreeAndFour).size).toBe(900);
    expect(new Set(gradesFiveAndSix).size).toBe(500);
  });
});

describe("recognition data", () => {
  it("covers grades 3 to 6 in order, with common confusable characters", () => {
    expect(gradesThreeAndFourEntries.map((e) => e.char)).toEqual(gradesThreeAndFour);
    expect(gradesFiveAndSixEntries.map((e) => e.char)).toEqual(gradesFiveAndSix);
    const common = new Set([...tableOne, ...tableTwo]);
    for (const e of [...gradesThreeAndFourEntries, ...gradesFiveAndSixEntries]) {
      expect(
        e.confusables.filter((c) => !common.has(c)),
        e.char,
      ).toEqual([]);
      expect(new Set(e.words.map((w) => w.text)).size, e.char).toBe(3);
    }
  });

  it("reads a word's own reading after an @", () => {
    const [entry] = parseCharacters("剥 bāo 剥皮 剥削@bō 剥落@bō 录拨");
    expect(entry?.words.map((w) => w.reading)).toEqual(["bāo", "bō", "bō"]);
  });

  it("rejects a word without its character", () => {
    expect(() => parseCharacters("哀 āi 哀伤 悲哀 求情 衰埃")).toThrow(/求情/);
  });

  it("deals the batches to the two grades of a stage in turn", () => {
    expect(recognitionByGrade.map((g) => [g.grade, g.batches.length])).toEqual([
      [3, 38],
      [4, 37],
      [5, 21],
      [6, 21],
    ]);
    expect(recognitionByGrade[3]?.batches.at(-1)?.entries).toHaveLength(10);
    expect(recognitionByGrade[2]?.batches.at(-1)?.entries).toHaveLength(10);
    expect(recognitionByGrade[0]?.batches[0]?.entries.map((e) => e.char).join("")).toBe("哀埃癌艾碍氨俺昂凹熬傲澳");
  });

  it("makes each character a word of the lexicon once", () => {
    const lexicon = characterLexicon();
    expect(lexicon).toHaveLength(3500);
    expect(new Set(lexicon.map((e) => e.word)).size).toBe(3500);
    expect(lexicon.filter((e) => e.topic !== undefined)).toHaveLength(1400);
  });
});

describe("otherTones", () => {
  it("are the syllable's other tones and the neutral one", () => {
    expect(otherTones("lüè")).toEqual(["lüē", "lüé", "lüě", "lüe"]);
    expect(otherTones("bo")).toEqual(["bō", "bó", "bǒ", "bò"]);
  });
});
