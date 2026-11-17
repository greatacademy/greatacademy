import type { SubjectDef } from "@ga/content";
import { compileSubject, t } from "@ga/content";
import { chineseCheckers, segmenter } from "@ga/subject-chinese";

import { characterLexicon } from "./characters/index.ts";
import { chineseCourses } from "./courses.ts";
import { idiomLexicon } from "./idioms/index.ts";
import { coreShardReading, coreShardTopics } from "./shards/core.ts";
import { wordLexicon } from "./words/index.ts";

const lexicon = [...characterLexicon(), ...wordLexicon(), ...idiomLexicon()];

/** chinese is the definition of the Chinese subject. */
export const chinese: SubjectDef = {
  id: "chinese",
  title: t("Chinese", "语文"),
  mark: "文",
  hue: 25,
  topics: coreShardTopics,
  courses: chineseCourses,
  checkers: chineseCheckers,
  lexicon,
  reading: coreShardReading,
  words: segmenter(lexicon.flatMap((e) => [e.word, ...(e.forms ?? [])])),
  strands: [
    { id: "pinyin", title: t("Pinyin", "拼音") },
    { id: "characters", title: t("Characters", "识字与写字") },
    { id: "words", title: t("Words", "词语") },
    { id: "grammar", title: t("Grammar and Punctuation", "语法与标点") },
    { id: "recitation", title: t("Recitation", "积累与背诵") },
    { id: "reading", title: t("Reading", "阅读") },
    { id: "writing", title: t("Writing", "写作") },
  ],
};

/** compileChinese compiles the Chinese subject; it throws a CompileError if the content is invalid. */
export const compileChinese = () => compileSubject(chinese);
