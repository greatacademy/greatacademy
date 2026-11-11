// Grade 3: building vocabulary batches from compact lines, one word to a line:
// word|other spellings, or -|meaning|meaning in Chinese|sentence|sentence|sentence|two confusions.

import type { Text, TopicDef } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { type BatchSpec, type BatchWord, batchTopic, batchWords } from "../batch.ts";
import { rows } from "./kit.ts";

/** fromClues is the share of context clues that reading a word in a sentence practices. */
const fromClues = [{ topic: "context-clues", weight: 0.1 }] as const;

/** wordLines reads the words of a batch from its lines. */
const wordLines = (lines: string): BatchWord[] =>
  rows(lines).map((row) => {
    const [word, forms, en, zh, s1, s2, s3, confusions] = row;
    if (!word || !forms || !en || !zh || !s1 || !s2 || !s3 || !confusions) throw new Error(`a word line needs eight fields: ${row[0]}`);
    const [c1, c2] = confusions.split(",").map((c) => c.trim());
    if (!c1 || !c2) throw new Error(`${word} needs two confusions`);
    return {
      word,
      ...(forms === "-" ? {} : { forms: forms.split(",").map((f) => f.trim()) }),
      meaning: [en, zh],
      sentences: [s1, s2, s3],
      confusions: [c1, c2],
    };
  });

/** Grade3Batch is what a batch of the course states; the rest is the same for every batch. */
export interface Grade3Batch {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly domain: readonly [en: string, zh: string];
  readonly lines: string;
}

/** spec builds the batch of a grade 3 topic, after context clues and worth 15 XP for its ten words. */
export const spec = (b: Grade3Batch): BatchSpec => ({
  id: b.id,
  title: b.title,
  summary: b.summary,
  domain: b.domain,
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: wordLines(b.lines),
  xp: 15,
});

/** batchesOf builds the topics and the word lists of batches. */
export const batchesOf = (batches: readonly Grade3Batch[]): { topics: TopicDef[]; words: WordBatch[] } => {
  const specs = batches.map(spec);
  return { topics: specs.map(batchTopic), words: specs.map(batchWords) };
};
