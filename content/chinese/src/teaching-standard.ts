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
  "dictionary-words",
  "language-3-similar-characters",
  "reading-3-fairy-tales",
  "reading-3-fables",
  "reading-3-poems",
  "reading-3-key-sentences",
  "reading-3-main-idea",
  "reading-3-science",
  "writing-3-imagination",
  "writing-3-note",
  "writing-3-favourite-thing",
  "revising-3",
  "speaking-3-listening",
  "speaking-3-relaying",
  "speaking-3-telling",
  "speaking-3-discussing",
  "language-4-polyphones",
  "reading-4-myths",
  "reading-4-folk-tales",
  "reading-4-narrative",
  "reading-4-feelings",
  "reading-4-everyday-texts",
  "reading-4-skimming",
  "writing-4-observation",
  "writing-4-imagination",
  "writing-4-place",
  "revising-4",
  "speaking-4-storytelling",
  "speaking-4-introducing",
  "speaking-4-occasions",
  "speaking-4-persuading",
];
