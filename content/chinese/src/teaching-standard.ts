// Which parts of the Chinese subject are written to the teaching standard (docs/content.md §4): an introduction, an
// explanation that walks one instance and ends with a callout, and solutions in steps that end with a check. The test
// beside this file holds every listed topic to it.

/** taughtStrands lists the strands whose every topic is written to the teaching standard. */
export const taughtStrands: readonly string[] = ["recitation"];

/**
 * taughtTopics lists further topics written to the standard while their strand is still being rewritten; once the
 * strand is listed in taughtStrands, its topics leave this list.
 */
export const taughtTopics: readonly string[] = [
  "pinyin-alphabet",
  "reading-1-rhymes",
  "reading-1-stories",
  "reading-1-signs",
  "reading-2-fables",
  "reading-2-fairy-tales",
  "reading-2-science",
  "writing-1-want-to-say",
  "writing-2-picture",
  "writing-2-imagination",
  "speaking-1-listening",
  "speaking-1-manners",
  "speaking-1-telling",
  "speaking-2-asking",
  "speaking-2-messages",
  "speaking-2-discussing",
];
