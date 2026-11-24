// Grade 3: building vocabulary batches from compact lines, one word to a line:
// word|other spellings, or -|meaning|meaning in Chinese|sentence|sentence|sentence|two confusions.

import type { Text, TopicDef } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { type BatchSpec, type BatchWord, batchTopicWithPool, batchWords, wordPool } from "../batch.ts";
import { rows } from "./kit.ts";

/** fromClues is the share of context clues that reading a word in a sentence practices. */
const fromClues = [{ topic: "context-clues", weight: 0.1 }] as const;

/** wordNotes reads hand-written natural clues, contrasts, per-distractor conflicts, and spelling notes keyed by word. */
const wordNotes = (notes: string) => {
  const byWord = new Map<
    string,
    {
      readonly clues: readonly [string, string, string];
      readonly contrast: readonly [string, string];
      readonly conflicts: readonly [readonly [string, string], readonly [string, string]];
      readonly spelling: readonly [string, string, string];
    }
  >();
  for (const row of rows(notes)) {
    const [word, clue1, clue2, clue3, contrastEn, contrastZh, c0En, c0Zh, c1En, c1Zh, chunks, trapEn, trapZh] = row;
    if (
      !word ||
      !clue1 ||
      !clue2 ||
      !clue3 ||
      !contrastEn ||
      !contrastZh ||
      !c0En ||
      !c0Zh ||
      !c1En ||
      !c1Zh ||
      !chunks ||
      !trapEn ||
      !trapZh
    ) {
      throw new Error(`a note line needs thirteen fields: ${row[0]}`);
    }
    byWord.set(word, {
      clues: [clue1, clue2, clue3],
      contrast: [contrastEn, contrastZh],
      conflicts: [
        [c0En, c0Zh],
        [c1En, c1Zh],
      ],
      spelling: [chunks, trapEn, trapZh],
    });
  }
  return byWord;
};

/** wordLines reads the words of a batch from its lines, attaching any hand-written notes. */
const wordLines = (lines: string, notes?: string): BatchWord[] => {
  const noteMap = notes ? wordNotes(notes) : undefined;
  return rows(lines).map((row) => {
    const [word, forms, en, zh, s1, s2, s3, confusions] = row;
    if (!word || !forms || !en || !zh || !s1 || !s2 || !s3 || !confusions) throw new Error(`a word line needs eight fields: ${row[0]}`);
    const [c1, c2] = confusions.split(",").map((c) => c.trim());
    if (!c1 || !c2) throw new Error(`${word} needs two confusions`);
    const note = noteMap?.get(word);
    if (noteMap && !note) throw new Error(`${word} is missing a hand-written note`);
    return {
      word,
      ...(forms === "-" ? {} : { forms: forms.split(",").map((f) => f.trim()) }),
      meaning: [en, zh],
      sentences: [s1, s2, s3],
      confusions: [c1, c2],
      ...(note ? { clues: note.clues, contrast: note.contrast, conflicts: note.conflicts, spelling: note.spelling } : {}),
    };
  });
};

/** Grade3Batch is what a batch of the course states; the rest is the same for every batch. */
export interface Grade3Batch {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly intro?: Text;
  readonly watchOut?: BatchSpec["watchOut"];
  readonly domain: readonly [en: string, zh: string];
  readonly lines: string;
  readonly notes?: string;
}

/** spec builds the batch of a grade 3 topic, after context clues and worth 15 XP for its ten words. */
export const spec = (b: Grade3Batch): BatchSpec => ({
  id: b.id,
  title: b.title,
  summary: b.summary,
  ...(b.intro ? { intro: b.intro } : {}),
  ...(b.watchOut ? { watchOut: b.watchOut } : {}),
  domain: b.domain,
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: wordLines(b.lines, b.notes),
  xp: 15,
});

/** batchesOf builds the topics and the word lists of batches. */
export const batchesOf = (batches: readonly Grade3Batch[]): { topics: TopicDef[]; words: WordBatch[] } => {
  const specs = batches.map(spec);
  const pool = wordPool(specs);
  return { topics: specs.map((s) => batchTopicWithPool(s, pool)), words: specs.map(batchWords) };
};
