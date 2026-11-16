import { createRng } from "@ga/content";
import { describe, expect, it } from "vitest";

import { dialogueSsml, partner, voice } from "./audio.ts";
import { english } from "./index.ts";
import { recordings } from "./recordings.ts";

const listening = english.topics.filter((topic) => topic.strand === "listening");

describe("listening", () => {
  it("plays only recordings that are made, since a problem cannot be answered without them", () => {
    expect(listening.length).toBeGreaterThan(0);
    const made = new Set(recordings.map((file) => file.replace(/\.mp3$/u, "")));
    const missing = new Set<string>();
    for (const topic of listening)
      topic.knowledgePoints.forEach((kp) => {
        for (let seed = 0; seed < 200; seed++)
          for (const path of kp.generate(createRng(seed)).listen ?? [])
            if (!made.has(path.slice("audio/english/".length))) missing.add(path);
        expect(kp.generate(createRng(0)).listen?.length, `${topic.id} ${kp.id}`).toBeGreaterThan(0);
      });
    expect([...missing]).toEqual([]);
  });

  it("reads a dialogue's lines in its two speakers' voices", () => {
    const ssml = dialogueSsml([
      { speaker: "a", text: "Where are you from?" },
      { speaker: "b", text: "I'm from Spain." },
    ]);
    expect(ssml).toContain(`<voice name="${voice.name}"><prosody rate="${voice.rate}">Where are you from?<break`);
    expect(ssml).toContain(`<voice name="${partner.name}"><prosody rate="${partner.rate}">I'm from Spain.</prosody></voice></speak>`);
  });

  it("gives each unit of A1 to B2 a listening module after its words and grammar", () => {
    for (const id of ["english-a1", "english-a2", "english-b1", "english-b2"]) {
      const course = english.courses.find((c) => c.id === id);
      for (const unit of course?.units ?? []) {
        const titles = unit.modules.map((m) => m.title.en);
        expect(titles, unit.title.en).toContain("Listening");
        expect(titles.indexOf("Listening"), unit.title.en).toBeGreaterThan(titles.indexOf("Words"));
      }
    }
  });
});
