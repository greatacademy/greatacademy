import type { SubjectDef } from "@ga/content";
import { compileSubject, t } from "@ga/content";
import { englishCheckers } from "@ga/subject-english";

import { englishConversations } from "./conversations.ts";
import { englishCourses } from "./courses.ts";
import { englishPacks, packLexicon } from "./packs.ts";
import { englishLexicon } from "./reading/lexicon.ts";
import { coreShardReading, coreShardTopics } from "./shards/core.ts";

/** english is the definition of the English subject. */
export const english: SubjectDef = {
  id: "english",
  title: t("English", "英语"),
  mark: "Aa",
  hue: 335,
  topics: coreShardTopics,
  courses: [...englishPacks.flatMap((pack) => pack.courses), ...englishCourses],
  checkers: englishCheckers,
  reading: coreShardReading,
  lexicon: packLexicon(englishLexicon),
  conversations: [...englishConversations, ...englishPacks.flatMap((pack) => pack.conversations)],
  strands: [
    { id: "vocabulary", title: t("Vocabulary", "词汇") },
    { id: "grammar", title: t("Grammar", "语法") },
    { id: "listening", title: t("Listening", "听力") },
    { id: "speaking", title: t("Speaking", "口语") },
    { id: "reading", title: t("Reading", "阅读") },
    { id: "writing", title: t("Writing", "写作") },
  ],
};

/** compileEnglish compiles the English subject; it throws a CompileError if the content is invalid. */
export const compileEnglish = () => compileSubject(english);
