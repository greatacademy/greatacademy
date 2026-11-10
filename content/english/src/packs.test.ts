import { bodyWords } from "@ga/content";
import { describe, expect, it } from "vitest";

import { englishTracks, levelPacks } from "./packs.ts";

describe("english packs", () => {
  it("teaches each word in one batch only within a track, of a topic of the same pack", () => {
    // A learner follows either the levels (and then an exam) or the native grades, so a word may be taught once in each.
    for (const track of englishTracks) {
      const taught = new Map<string, string>();
      for (const pack of track) {
        const own = new Set(pack.topics.map((topic) => topic.id));
        for (const batch of pack.vocabulary) {
          expect(own, `the batch of ${batch.topic}`).toContain(batch.topic);
          for (const word of batch.words) {
            expect(taught.get(word), `${word} in ${batch.topic}`).toBeUndefined();
            taught.set(word, batch.topic);
          }
        }
      }
    }
  });

  it("writes the passages of each level in words taught at that level or below, needing their batches", () => {
    const taught = new Map<string, string>();
    for (const [level, pack] of levelPacks) {
      for (const batch of pack.vocabulary) for (const word of batch.words) taught.set(word, batch.topic);
      for (const unit of pack.reading) {
        for (const passage of unit.passages) {
          const free = new Set([...(passage.names ?? []), ...(passage.glossed ?? [])].map((w) => w.toLowerCase()));
          const needs = new Set(passage.topics.map((edge) => edge.topic));
          for (const word of bodyWords(passage.body)) {
            if (free.has(word)) continue;
            const topic = taught.get(word);
            expect(topic, `${level} ${passage.id}: ${word} is taught by no batch of ${level} or below`).toBeDefined();
            if (topic !== undefined) expect(needs, `${passage.id} uses ${word} of ${topic}`).toContain(topic);
          }
        }
      }
    }
  });
});
