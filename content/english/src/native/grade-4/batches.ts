// Grade 4: the reader of the compact lines the word batches are written in, one word a line:
// word/form,form|meaning|中文释义|sentence|sentence|sentence|confusion,confusion

import { type Text, t } from "@ga/content";
import { type BatchSpec, type BatchWord, batchTopic } from "../batch.ts";

const fromClues = [{ topic: "context-clues", weight: 0.1 }] as const;

/** BatchLines is a batch as its id, title, domain and lines of words. */
export interface BatchLines {
  readonly id: string;
  readonly title: readonly [en: string, zh: string];
  readonly domain: readonly [en: string, zh: string];
  readonly lines: string;
}

/** parseWords reads the lines of a batch into its words. */
const parseWords = (id: string, lines: string): BatchWord[] =>
  lines
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
      return {
        word,
        ...(forms ? { forms: forms.split(",").map((f) => f.trim()) } : {}),
        meaning: [en, zh] as const,
        sentences: [s1, s2, s3] as const,
        confusions: [pair[0] as string, pair[1] as string] as const,
      };
    });

/** batchSpec builds the spec of a batch from its lines, worth 1.5 XP a word. */
export const batchSpec = (b: BatchLines): BatchSpec => {
  const words = parseWords(b.id, b.lines);
  const shown = words.slice(0, 4).map((w) => w.word);
  const summary: Text = t(
    `${words.length} words of ${b.domain[0]}: ${shown.join(", ")} and more.`,
    `${words.length}个关于${b.domain[1]}的词：${shown.join("、")}等。`,
  );
  return {
    id: b.id,
    title: t(b.title[0], b.title[1]),
    summary,
    domain: b.domain,
    prerequisites: ["context-clues"],
    encompasses: fromClues,
    words,
    xp: Math.max(10, Math.round(words.length * 1.5)),
  };
};

export { batchTopic };
