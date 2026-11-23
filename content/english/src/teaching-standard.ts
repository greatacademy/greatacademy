// Which parts of the English subject are written to the teaching standard (docs/content.md §4): an introduction, an
// explanation that walks one instance and ends with a callout, and solutions in steps that end with a check. The test
// beside this file holds every listed topic to it.

/** taughtStrands lists the strands whose every topic is written to the teaching standard. */
export const taughtStrands: readonly string[] = [];

/**
 * taughtTopics lists further topics written to the standard while their strand is still being rewritten; once the
 * strand is listed in taughtStrands, its topics leave this list.
 */
export const taughtTopics: readonly string[] = [
  "capital-and-small-letters",
  "alphabetical-order",
  "first-and-last-letters",
  "reading-short-vowel-words",
  "spelling-short-vowel-words",
  "reading-words-with-digraphs",
  "spelling-words-with-digraphs",
  "reading-words-with-blends",
  "spelling-words-with-blends",
  "reading-words-with-silent-e",
  "spelling-words-with-silent-e",
  "reading-words-with-vowel-teams",
  "spelling-words-with-vowel-teams",
  "reading-sight-words",
  "spelling-sight-words",
  "reading-decodable-sentences",
  "writing-decodable-sentences",
];
