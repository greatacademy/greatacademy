// Grade 3: helpers for the reading units of the course, so that each passage reads as its id, title, body, topics,
// questions and names.

import { type ReadingUnitDef, type Text, t } from "@ga/content";

type PassageDef = ReadingUnitDef["passages"][number];
type QuestionDef = PassageDef["questions"][number];
type TopicEdge = PassageDef["topics"][number];
type Pair = readonly [en: string, zh: string];

/** ask builds a passage question from its prompt, right answer, three wrong answers and solution, each a pair. */
export const ask = (prompt: Pair, right: Pair, wrong: readonly [Pair, Pair, Pair], solution: Pair): QuestionDef => ({
  prompt: t(...prompt),
  right: t(...right),
  wrong: wrong.map((w) => t(...w)),
  solution: t(...solution),
});

/** passage builds a passage worth 4 XP, with the proper names and the explained terms it uses outside the lexicon. */
export const passage = (
  id: string,
  title: Text,
  body: string,
  topics: readonly TopicEdge[],
  questions: readonly QuestionDef[],
  names: readonly string[] = [],
  glossed: readonly string[] = [],
): PassageDef => ({
  id,
  title,
  body,
  topics,
  questions,
  xp: 4,
  ...(names.length > 0 ? { names } : {}),
  ...(glossed.length > 0 ? { glossed } : {}),
});

/** clues is the share of context clues that reading any passage practices. */
export const clues = { topic: "context-clues", weight: 0.3 } as const;

/** words is the share of a vocabulary topic that a passage practices. */
export const words = (topic: string, weight = 0.2): TopicEdge => ({ topic, weight });
