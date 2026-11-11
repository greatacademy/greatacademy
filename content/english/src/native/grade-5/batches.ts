// Grade 5: the helper that turns lines of a batch into a vocabulary topic, so that each word reads as one line.

import { t } from "@ga/content";
import { type BatchSpec, type BatchWord, batchTopic, batchWords } from "../batch.ts";
import type { Pair } from "./kit.ts";
import { rows } from "./kit.ts";

/**
 * BatchLines are the words of a batch, one to a line: word|meaning|中文意思|sentence|sentence|sentence|confusion,confusion
 * and, optionally, |form,form for the other spellings a passage may use.
 */
export type BatchLines = string;

/** batch builds the specification of a vocabulary topic of grade 5, worth 15 XP for its ten words. */
export const batch = (id: string, title: Pair, domain: Pair, lines: BatchLines, prerequisite = "context-clues"): BatchSpec => {
  const words = rows(lines).map((row): BatchWord => {
    const [word, en, zh, s1, s2, s3, confusions, forms] = row;
    const pair = (confusions ?? "").split(",").map((c) => c.trim());
    if (!word || !en || !zh || !s1 || !s2 || !s3 || pair.length !== 2 || !pair[0] || !pair[1])
      throw new Error(`${id}: a word line needs seven fields: ${row.join("|")}`);
    return {
      word,
      meaning: [en, zh],
      sentences: [s1, s2, s3],
      confusions: [pair[0], pair[1]],
      ...(forms ? { forms: forms.split(",").map((f) => f.trim()) } : {}),
    };
  });
  if (words.length !== 10) throw new Error(`${id}: a batch has ten words, not ${words.length}`);
  const first = words.slice(0, 4).map((w) => w.word);
  return {
    id,
    title: t(...title),
    summary: t(`Ten words of ${domain[0]}: ${first.join(", ")} and more.`, `十个有关${domain[1]}的词：${first.join("、")} 等。`),
    domain,
    prerequisites: [prerequisite],
    encompasses: [{ topic: prerequisite, weight: 0.1 }],
    words,
    xp: 15,
  };
};

export { batchTopic, batchWords };
