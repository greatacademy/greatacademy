// Further knowledge points for topics of 4th Grade Math, each a skill the topic's
// own points leave out: working backwards, reasoning about a whole problem instead
// of one step, or a fact used in a new setting. See `deeperGrade4Points`.

import type { KnowledgePointDef } from "@ga/content";
import { equivalentWithSum, hundredthsApart, hundredthsToAWhole, wholeFromPart } from "./grade-4-fractions.ts";
import {
  countingFactors,
  countingMultiples,
  dividendFromQuotient,
  estimateError,
  farTermOfPattern,
  fullHundreds,
  largestDifference,
  largestEqualGroups,
  largestWithQuotient,
  missingDigitInFactor,
  nextPrime,
  positionInPattern,
  smallestThatRounds,
  thirdFromTotal,
  totalFromTimes,
  whenEventsMeet,
} from "./grade-4-further.ts";
import { clockAngle, equalAnglesAroundPoint, rectangleFromRatio, startFromElapsed, twoStepTime } from "./grade-4-measurement.ts";

/** deeperGrade4Points maps topics of 4th Grade Math to further knowledge points. */
export const deeperGrade4Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "rounding-up-whole-numbers": [smallestThatRounds],
  "estimating-multi-digit-addition": [estimateError],
  "adding-three-multi-digit-numbers": [thirdFromTotal],
  "subtracting-three-digit-numbers": [largestDifference],
  "products-and-factors": [countingFactors],
  "prime-and-composite-numbers": [nextPrime],
  "least-common-multiple-by-listing": [whenEventsMeet],
  "greatest-common-factor-by-listing": [largestEqualGroups],
  "connecting-factors-and-multiples": [countingMultiples],
  "finding-remainders": [dividendFromQuotient],
  "division-with-remainders": [largestWithQuotient],
  "dividing-by-10-100-and-1000": [fullHundreds],
  "word-problems-involving-additive-and-multiplicative-comparison": [totalFromTimes],
  "generating-patterns": [farTermOfPattern],
  "identifying-patterns": [positionInPattern],
  "equivalent-fractions-by-multiplying-and-dividing": [equivalentWithSum],
  "multiplying-fractions-by-whole-numbers-word-problems": [wholeFromPart],
  "comparing-decimals-up-to-hundredths": [hundredthsApart],
  "adding-decimal-fractions": [hundredthsToAWhole],
  "units-of-time-and-elapsed-time": [startFromElapsed],
  "converting-units-of-time-to-smaller-units": [twoStepTime],
  "sums-of-angles": [equalAnglesAroundPoint],
  "solving-angle-problems": [clockAngle],
  "modeling-with-rectangles": [rectangleFromRatio],
  "multi-digit-by-one-digit-multiplication-using-place-value": [missingDigitInFactor],
};
