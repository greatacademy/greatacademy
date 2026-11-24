// Grade 4: the reader of the compact lines the word batches are written in, one word a line:
// word/form,form|meaning|中文释义|sentence|sentence|sentence|confusion,confusion

import { type Text, t } from "@ga/content";
import { type BatchSpec, type BatchWord, batchTopic } from "../batch.ts";

const fromClues = [{ topic: "context-clues", weight: 0.1 }] as const;

/** BatchLines is a batch as its id, title, domain and lines of words. */
export interface BatchLines {
  readonly id: string;
  readonly title: readonly [en: string, zh: string];
  readonly intro: Text;
  readonly watchOut: NonNullable<BatchSpec["watchOut"]>;
  readonly domain: readonly [en: string, zh: string];
  readonly lines: string;
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

/** parseWords reads the lines of a batch into its words. */
const parseWords = (id: string, lines: string, notes?: string): BatchWord[] => {
  const noteMap = notes ? parseNotes(id, notes) : undefined;
  return lines
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => {
      const [head, en, zh, s1, s2, s3, confusions, ...rest] = line.split("|").map((f) => f.trim());
      const [word, forms] = (head ?? "").split("/");
      const pair = (confusions ?? "").split(",").map((c) => c.trim());
      if (!word || !en || !zh || !s1 || !s2 || !s3 || pair.length !== 2 || rest.length > 0)
        throw new Error(`${id}: a word line needs seven fields: ${line}`);
      for (const s of [s1, s2, s3]) if (!s.includes("___")) throw new Error(`${id}: a sentence of ${word} has no gap`);
      const note = noteMap?.get(word);
      if (noteMap && !note) throw new Error(`${id}: ${word} is missing a hand-written note`);
      return {
        word,
        ...(forms ? { forms: forms.split(",").map((f) => f.trim()) } : {}),
        meaning: [en, zh] as const,
        sentences: [s1, s2, s3] as const,
        confusions: [pair[0] as string, pair[1] as string] as const,
        ...(note ? { clues: note.clues, contrast: note.contrast, conflicts: note.conflicts, spelling: note.spelling } : {}),
      };
    });
};

/** batchSpec builds the spec of a batch from its lines, worth 1.5 XP a word. */
export const batchSpec = (b: BatchLines): BatchSpec => {
  const words = parseWords(b.id, b.lines, b.notes);
  const shown = words.slice(0, 4).map((w) => w.word);
  const summary: Text = t(
    `${words.length} words of ${b.domain[0]}: ${shown.join(", ")} and more.`,
    `${words.length}个关于${b.domain[1]}的词：${shown.join("、")}等。`,
  );
  return {
    id: b.id,
    title: t(b.title[0], b.title[1]),
    summary,
    ...(b.intro ? { intro: b.intro } : {}),
    ...(b.watchOut ? { watchOut: b.watchOut } : {}),
    domain: b.domain,
    prerequisites: ["context-clues"],
    encompasses: fromClues,
    words,
    xp: Math.max(10, Math.round(words.length * 1.5)),
  };
};

export { batchTopic };
