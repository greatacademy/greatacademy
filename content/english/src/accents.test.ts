import type { PassageDef } from "@ga/content";
import { describe, expect, it } from "vitest";

import { accents } from "./accents.ts";
import { accentVoices, passageRecording, voice, wantedRecordings } from "./audio.ts";
import { english } from "./index.ts";
import { americanSpellings, britishSpelling, toBritish, withBritishForms } from "./spelling.ts";

/** AMERICAN_WORDS are words a British or Australian speaker would say otherwise, in every sense. */
const AMERICAN_WORDS = new Set([
  "apartment",
  "apartments",
  "candy",
  "cookie",
  "cookies",
  "downtown",
  "elevator",
  "elevators",
  "freeway",
  "garbage",
  "gasoline",
  "math",
  "mom",
  "moms",
  "movie",
  "movies",
  "sidewalk",
  "sidewalks",
  "soccer",
  "trash",
  "vacation",
  "vacations",
]);

/** BRITISH_ONLY are words a British speaker would say otherwise, though an Australian says them. */
const BRITISH_ONLY = new Set(["dollar", "dollars"]);

const passages = new Map<string, PassageDef>((english.reading ?? []).flatMap((u) => u.passages.map((p) => [p.id, p])));

/** english lists the English text of a passage: its body, title and questions. */
const englishOf = (p: PassageDef): string =>
  [p.body, p.title.en, ...p.questions.flatMap((q) => [q.prompt.en, q.right.en, ...q.wrong.map((w) => w.en), q.solution.en])].join("\n");

describe("britishSpelling", () => {
  it("respells the regular differences and keeps the rest", () => {
    expect(
      [
        "color",
        "favorite",
        "neighborhood",
        "center",
        "kilometers",
        "traveled",
        "canceling",
        "realized",
        "organization",
        "analyze",
        "gray",
      ].map(britishSpelling),
    ).toEqual([
      "colour",
      "favourite",
      "neighbourhood",
      "centre",
      "kilometres",
      "travelled",
      "cancelling",
      "realised",
      "organisation",
      "analyse",
      "grey",
    ]);
    for (const w of ["size", "prize", "seized", "citizen", "humorous", "vigorous", "program", "check", "dozen"])
      expect(britishSpelling(w)).toBe(w);
  });

  it("keeps the case of the word", () => {
    expect(toBritish("Color, COLOR and color: the Center.")).toBe("Colour, COLOUR and colour: the Centre.");
  });

  it("adds British forms to the lexicon only where no entry spells them", () => {
    const lexicon = withBritishForms([{ word: "color", forms: ["colors"] }, { word: "grey" }, { word: "gray" }]);
    expect(lexicon[0]?.forms).toEqual(["colors", "colour", "colours"]);
    expect(lexicon[2]?.forms).toBeUndefined();
  });
});

describe("accents", () => {
  it("names passages that exist and are recorded", () => {
    for (const id of accents.keys()) expect(passages.has(id), id).toBe(true);
  });

  it("spells each passage as its speaker would", () => {
    for (const [id, accent] of accents) {
      const text = englishOf(passages.get(id)!);
      expect(americanSpellings(text), id).toEqual([]);
      const words = new Set((text.match(/\p{L}+/gu) ?? []).map((w) => w.toLowerCase()));
      const said = [...words].filter((w) => AMERICAN_WORDS.has(w) || (accent === "gb" && BRITISH_ONLY.has(w)));
      expect(said, id).toEqual([]);
    }
  });

  it("reads each passage in its accent's voice, and the others in the usual one", () => {
    const voices = new Set(
      [...wantedRecordings().values()].filter((w) => w.kind === "passage").map((w) => /voice name="([^"]+)"/u.exec(w.ssml)?.[1]),
    );
    expect(voices).toEqual(new Set([voice.name, accentVoices.gb.voice.name, accentVoices.au.voice.name]));
    const p = passages.get("fce-reading-a-year-without-a-phone")!;
    expect(passageRecording(p)).not.toBe(passageRecording({ ...p, id: "not-in-accents" }));
  });
});
