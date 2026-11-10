// Grades 6 to 8: helpers for the reading units of the course, so that each passage reads as its id, title, body,
// topics, questions and names.

import type { ReadingUnitDef, Text } from "@ga/content";

type PassageDef = ReadingUnitDef["passages"][number];
type QuestionDef = PassageDef["questions"][number];
type TopicEdge = PassageDef["topics"][number];

/** ask builds a passage question from its prompt, right answer, three wrong answers and solution. */
export const ask = (prompt: Text, right: Text, wrong: readonly [Text, Text, Text], solution: Text): QuestionDef => ({
  prompt,
  right,
  wrong,
  solution,
});

/** passage builds a passage worth 4 XP, with the proper names it uses outside the lexicon. */
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
