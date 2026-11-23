// Which parts of the Chinese subject are written to the teaching standard (docs/content.md §4): an introduction, an
// explanation that walks one instance and ends with a callout, and solutions in steps that end with a check. The test
// beside this file holds every listed topic to it.

/** taughtStrands lists the strands whose every topic is written to the teaching standard. */
export const taughtStrands: readonly string[] = [
  "recitation",
  "classical",
  "pinyin",
  "grammar",
  "characters",
  "words",
  "listening",
  "speaking",
  "writing",
  "reading",
];

/**
 * taughtTopics lists further topics written to the standard while their strand is still being rewritten; once the
 * strand is listed in taughtStrands, its topics leave this list.
 */
export const taughtTopics: readonly string[] = [];
