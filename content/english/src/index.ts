import type { SubjectDef } from "@ga/content";
import { compileSubject, t } from "@ga/content";
import { englishCheckers } from "@ga/subject-english";

import { englishCourses } from "./courses.ts";
import { englishLexicon } from "./reading/lexicon.ts";
import { coreShardReading, coreShardTopics } from "./shards/core.ts";

/** english is the definition of the English subject. */
export const english: SubjectDef = {
  id: "english",
  title: t("English", "英语"),
  mark: "Aa",
  hue: 335,
  topics: coreShardTopics,
  courses: englishCourses,
  checkers: englishCheckers,
  reading: coreShardReading,
  lexicon: englishLexicon,
};

/** compileEnglish compiles the English subject; it throws a CompileError if the content is invalid. */
export const compileEnglish = () => compileSubject(english);
