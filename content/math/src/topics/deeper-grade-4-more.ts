// A second set of further knowledge points for 4th Grade Math, mostly the same facts run
// backwards. See `deeperGrade4MorePoints`.

import type { KnowledgePointDef } from "@ga/content";
import { fractionsBetween, hundredthsInADecimal, shareOfAGroup } from "./grade-4-fractions.ts";
import {
  fiveDigitFromCards,
  largeMissingAddend,
  largestRemainder,
  missingFactorInExpression,
  missingPartial,
  numberBeforeSubtraction,
  theDividend,
  threeLcm,
  timesAsGreatDigit,
} from "./grade-4-further.ts";
import { aroundAPoint, bagsFromKilograms, minuteHand, twoUnitLengths } from "./grade-4-measurement.ts";

/** deeperGrade4MorePoints maps topics of 4th Grade Math to a second set of further knowledge points. */
export const deeperGrade4MorePoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "place-value-with-numbers-up-to-seven-digits": [timesAsGreatDigit],
  "comparing-whole-numbers-using-place-value": [fiveDigitFromCards],
  "adding-numbers-up-to-seven-digits": [largeMissingAddend],
  "subtracting-numbers-up-to-seven-digits": [numberBeforeSubtraction],
  "least-common-multiple": [threeLcm],
  "two-digit-by-two-digit-multiplication-using-place-value": [missingPartial],
  "understanding-remainders-using-models": [theDividend],
  "two-digit-by-one-digit-division-with-remainders-using-partial-quotients": [largestRemainder],
  "evaluating-expressions-involving-addition-and-multiplication": [missingFactorInExpression],
  "comparing-fractions": [fractionsBetween],
  "multiplying-fractions-by-whole-numbers": [shareOfAGroup],
  "decimal-fractions": [hundredthsInADecimal],
  "converting-metric-units-of-length-to-smaller-units": [twoUnitLengths],
  "converting-units-of-mass-to-smaller-units": [bagsFromKilograms],
  "connecting-angles-and-circles": [minuteHand],
  "acute-obtuse-and-reflex-angles": [aroundAPoint],
};
