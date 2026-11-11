// Grade 4: the shorthand the reading units are written in.

import { type PassageDef, type PassageQuestionDef, t } from "@ga/content";

/** Pair is a text in English and in Chinese. */
type Pair = readonly [en: string, zh: string];

/** q builds a question of a passage from its prompt, right option, three wrong options and solution. */
export const q = (prompt: Pair, right: Pair, wrong: readonly [Pair, Pair, Pair], solution: Pair): PassageQuestionDef => ({
  prompt: t(prompt[0], prompt[1]),
  right: t(right[0], right[1]),
  wrong: wrong.map(([en, zh]) => t(en, zh)),
  solution: t(solution[0], solution[1]),
});

/** Edge is a topic a passage practices, with its weight. */
export type Edge = { readonly topic: string; readonly weight: number };

/** edge names a topic a passage practices, with its weight. */
export const edge = (topic: string, weight = 0.2): Edge => ({ topic, weight });

/** passage builds a passage of four minutes from its parts; the body's paragraphs are separated by blank lines. */
export const passage = (
  id: string,
  title: Pair,
  body: string,
  topics: readonly Edge[],
  questions: readonly [PassageQuestionDef, PassageQuestionDef, PassageQuestionDef],
  extra: { readonly names?: readonly string[]; readonly glossed?: readonly string[] } = {},
): PassageDef => ({
  id,
  title: t(title[0], title[1]),
  body: body.trim().replace(/\n[ \t]+/g, "\n"),
  topics,
  ...(extra.names && { names: extra.names }),
  ...(extra.glossed && { glossed: extra.glossed }),
  xp: 4,
  questions,
});
