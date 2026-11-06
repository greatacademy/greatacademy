import type { SubjectDef } from "@ga/content";
import { compileSubject, t } from "@ga/content";
import { englishCheckers } from "@ga/subject-english";

import { englishCourses } from "./courses.ts";
import { coreShardTopics } from "./shards/core.ts";

/** english is the definition of the English subject. */
export const english: SubjectDef = {
  id: "english",
  title: t("English", "英语"),
  topics: coreShardTopics,
  courses: englishCourses,
  checkers: englishCheckers,
};

/** compileEnglish compiles the English subject; it throws a CompileError if the content is invalid. */
export const compileEnglish = () => compileSubject(english);
