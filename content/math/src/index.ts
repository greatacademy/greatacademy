import type { SubjectDef, TopicDef } from "@ga/content";
import { compileSubject, t } from "@ga/content";
import { mathCheckers } from "@ga/subject-math";

import { mathCourses } from "./courses.ts";
import { inferredEncompassings } from "./encompassings.ts";
import { algebraShardTopics } from "./shards/algebra.ts";
import { calculusShardTopics } from "./shards/calculus.ts";
import { collegeShardTopics } from "./shards/college.ts";
import { examShardTopics } from "./shards/exam.ts";
import { schoolShardTopics } from "./shards/school.ts";

/** withEncompassings fills in the inferred encompassings of a topic that has none of its own. */
function withEncompassings(topic: TopicDef): TopicDef {
  return { ...topic, encompasses: topic.encompasses.length ? topic.encompasses : (inferredEncompassings[topic.id] ?? []) };
}

/** math is the definition of the mathematics subject. */
export const math: SubjectDef = {
  id: "math",
  title: t("Mathematics", "数学"),
  mark: "∑",
  hue: 235,
  topics: [...schoolShardTopics, ...collegeShardTopics, ...algebraShardTopics, ...calculusShardTopics, ...examShardTopics].map(
    withEncompassings,
  ),
  courses: mathCourses,
  checkers: mathCheckers,
};

/** compileMath compiles the mathematics subject; it throws a CompileError if the content is invalid. */
export const compileMath = () => compileSubject(math);
