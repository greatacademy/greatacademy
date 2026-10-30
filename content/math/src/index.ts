import type { SubjectDef } from "@ga/content";
import { compileSubject, t } from "@ga/content";
import { mathCheckers } from "@ga/subject-math";

import { mathCourses } from "./courses.ts";
import { decimalAndPercentTopics } from "./topics/decimals-and-percents.ts";
import { equationTopics } from "./topics/equations.ts";
import { expressionTopics } from "./topics/expressions.ts";
import { fractionTopics } from "./topics/fractions.ts";
import { inequalityTopics } from "./topics/inequalities.ts";
import { integerTopics } from "./topics/integers.ts";
import { numberTheoryTopics } from "./topics/number-theory.ts";
import { ratioTopics } from "./topics/ratios.ts";

/** math is the definition of the mathematics subject. */
export const math: SubjectDef = {
  id: "math",
  title: t("Mathematics", "数学"),
  topics: [
    ...numberTheoryTopics,
    ...fractionTopics,
    ...decimalAndPercentTopics,
    ...integerTopics,
    ...expressionTopics,
    ...equationTopics,
    ...inequalityTopics,
    ...ratioTopics,
  ],
  courses: mathCourses,
  checkers: mathCheckers,
};

/** compileMath compiles the mathematics subject; it throws a CompileError if the content is invalid. */
export const compileMath = () => compileSubject(math);
