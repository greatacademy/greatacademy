import { createRng } from "@ga/content";
import { describe, expect, it } from "vitest";

import { recordingName, syllableSsml, voice, wantedRecordings } from "./audio.ts";
import { chinese } from "./index.ts";
import { recordings } from "./recordings.ts";

describe("listening", () => {
  it("plays only recordings that are made, since a problem cannot be answered without them", () => {
    const made = new Set(recordings.map((file) => file.replace(/\.mp3$/u, "")));
    const missing = new Set<string>();
    let played = 0;
    for (const topic of chinese.topics)
      topic.knowledgePoints.forEach((kp) => {
        for (let seed = 0; seed < 200; seed++)
          for (const path of kp.generate(createRng(seed)).listen ?? []) {
            played++;
            if (!made.has(path.slice("audio/chinese/".length))) missing.add(path);
          }
      });
    expect(played).toBeGreaterThan(0);
    expect([...missing]).toEqual([]);
  });

  it("lists each recording the content asks for as it is now, so none is stale", () => {
    expect(recordings.filter((file) => !wantedRecordings().has(file))).toEqual([]);
  });

  it("says a syllable by its SAPI phonemes, with ü as v, carried by a character", () => {
    const ssml = syllableSsml("女", "nü", 3);
    expect(ssml).toContain(`<voice name="${voice.name}"><prosody rate="${voice.rate}"><phoneme alphabet="sapi" ph="nv 3">女</phoneme>`);
    expect(recordingName(ssml)).toMatch(/^[0-9a-f]{16}$/u);
  });
});
