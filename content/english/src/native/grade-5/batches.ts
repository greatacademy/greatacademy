// Grade 5: the helper that turns lines of a batch into a vocabulary topic, so that each word reads as one line.

import { type Text, t } from "@ga/content";
import { type BatchSpec, type BatchWord, batchTopic, batchWords } from "../batch.ts";
import type { Pair } from "./kit.ts";
import { rows } from "./kit.ts";

/**
 * BatchLines are the words of a batch, one to a line: word|meaning|中文意思|sentence|sentence|sentence|confusion,confusion
 * and, optionally, |form,form for the other spellings a passage may use.
 */
export type BatchLines = string;

/** BatchTeaching holds the hand-written scene intro, topic-specific Watch out, and 13-field per-word notes. */
export interface BatchTeaching {
  readonly intro: Text;
  readonly watchOut: NonNullable<BatchSpec["watchOut"]>;
  readonly notes: string;
}

/** parseNotes reads hand-written clues, contrasts, per-distractor conflicts, and spelling notes keyed by word. */
const parseNotes = (id: string, notes: string) => {
  const byWord = new Map<
    string,
    {
      readonly clues: readonly [string, string, string];
      readonly contrast: readonly [string, string];
      readonly conflicts: readonly [readonly [string, string], readonly [string, string]];
      readonly spelling: readonly [string, string, string];
    }
  >();
  for (const raw of notes.trim().split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const fields = line.split("|").map((f) => f.trim());
    const [word, clue1, clue2, clue3, contrastEn, contrastZh, c0En, c0Zh, c1En, c1Zh, chunks, trapEn, trapZh, ...rest] = fields;
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
      !trapZh ||
      rest.length > 0
    ) {
      throw new Error(`${id}: a note line needs thirteen fields: ${word ?? line}`);
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

/** batch builds the specification of a vocabulary topic of grade 5, worth 15 XP for its ten words. */
export const batch = (
  id: string,
  title: Pair,
  domain: Pair,
  lines: BatchLines,
  prerequisite = "context-clues",
  teaching?: BatchTeaching,
): BatchSpec => {
  const noteMap = teaching ? parseNotes(id, teaching.notes) : undefined;
  const words = rows(lines).map((row): BatchWord => {
    const [word, en, zh, s1, s2, s3, confusions, forms] = row;
    const pair = (confusions ?? "").split(",").map((c) => c.trim());
    if (!word || !en || !zh || !s1 || !s2 || !s3 || pair.length !== 2 || !pair[0] || !pair[1])
      throw new Error(`${id}: a word line needs seven fields: ${row.join("|")}`);
    const note = noteMap?.get(word);
    if (noteMap && !note) throw new Error(`${id}: ${word} is missing a hand-written note`);
    return {
      word,
      meaning: [en, zh],
      sentences: [s1, s2, s3],
      confusions: [pair[0], pair[1]],
      ...(forms ? { forms: forms.split(",").map((f) => f.trim()) } : {}),
      ...(note ? { clues: note.clues, contrast: note.contrast, conflicts: note.conflicts, spelling: note.spelling } : {}),
    };
  });
  if (words.length !== 10) throw new Error(`${id}: a batch has ten words, not ${words.length}`);
  const first = words.slice(0, 4).map((w) => w.word);
  return {
    id,
    title: t(...title),
    summary: t(`Ten words of ${domain[0]}: ${first.join(", ")} and more.`, `十个有关${domain[1]}的词：${first.join("、")} 等。`),
    ...(teaching ? { intro: teaching.intro, watchOut: teaching.watchOut } : {}),
    domain,
    prerequisites: [prerequisite],
    encompasses: [{ topic: prerequisite, weight: 0.1 }],
    words,
    xp: 15,
  };
};

export { batchTopic, batchWords };
