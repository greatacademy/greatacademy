import type { SubjectDef } from "@ga/content";
import { compileSubject, t } from "@ga/content";
import { mathCheckers } from "@ga/subject-math";

import { mathCourses } from "./courses.ts";
import { angleTopics } from "./topics/angles.ts";
import { areaTopics } from "./topics/area.ts";
import { decimalAndPercentTopics } from "./topics/decimals-and-percents.ts";
import { equationTopics } from "./topics/equations.ts";
import { exponentTopics } from "./topics/exponents.ts";
import { expressionTopics } from "./topics/expressions.ts";
import { fractionTopics } from "./topics/fractions.ts";
import { inequalityTopics } from "./topics/inequalities.ts";
import { integerTopics } from "./topics/integers.ts";
import { numberTheoryTopics } from "./topics/number-theory.ts";
import { polynomialTopics } from "./topics/polynomials.ts";
import { radicalTopics } from "./topics/radicals.ts";
import { ratioTopics } from "./topics/ratios.ts";
import { sequenceTopics } from "./topics/sequences.ts";
import { statisticsTopics } from "./topics/statistics.ts";
import { unitTopics } from "./topics/units.ts";

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
    ...exponentTopics,
    ...radicalTopics,
    ...equationTopics,
    ...inequalityTopics,
    ...ratioTopics,
    ...statisticsTopics,
    ...angleTopics,
    ...areaTopics,
    ...unitTopics,
    ...polynomialTopics,
    ...sequenceTopics,
  ],
  courses: mathCourses,
  checkers: mathCheckers,
};

/** compileMath compiles the mathematics subject; it throws a CompileError if the content is invalid. */
export const compileMath = () => compileSubject(math);
