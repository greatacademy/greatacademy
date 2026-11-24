// Further knowledge points for topics of 5th Grade Math, each a skill the topic's
// own points leave out: working backwards, reasoning about a whole problem instead
// of one step, or a fact used in a new setting. See `deeperGrade5Points`.

import type { KnowledgePointDef } from "@ga/content";

import {
  aDecimalProductFromAWholeNumberProduct,
  aDecimalQuotientFromAWholeNumberQuotient,
  countingDecimalsBetweenTwoDecimals,
  countingSignificantFiguresInADecimal,
  theDecimalThatCompletesAWholeNumber,
  theEndsOfARoundedDecimal,
  theLastDigitOfALargePower,
  theMissingExponent,
  zerosAtTheEndOfAPowerOfAMultipleOfTen,
} from "./grade-5-decimals.ts";
import {
  aFractionOfWhatIsLeft,
  aMissingFractionInASum,
  fullPiecesCutFromALength,
  theReciprocalOfASum,
  theWholeAmountFromAFractionOfIt,
  whatIsLeftAfterTwoFractions,
  whatMixedNumberCompletesATotal,
} from "./grade-5-fractions.ts";
import {
  aFarTermOfARelatedPattern,
  aSquareWithTheSamePerimeter,
  diagonalsFromOneVertex,
  howManyCubesFillABox,
  howVolumeGrowsWhenEdgesGrow,
  theAreaOfARectangleFromItsCorners,
} from "./grade-5-measurement.ts";
import {
  aNewProductFromAKnownProduct,
  howMuchParenthesesChange,
  theGapAcrossZero,
  theLeastToAddForAMultiple,
  theNumberOfDigitsInAProduct,
} from "./grade-5-whole-numbers.ts";
import { countingIntegersWithASmallAbsoluteValue, integersBetweenANegativeAndAPositive } from "./integers.ts";

/** deeperGrade5Points maps topics of 5th Grade Math to further knowledge points. */
export const deeperGrade5Points: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "absolute-value": [countingIntegersWithASmallAbsoluteValue],
  "integers-and-opposites": [integersBetweenANegativeAndAPositive],
  "negative-numbers": [theGapAcrossZero],
  "evaluating-whole-number-expressions-with-parentheses": [howMuchParenthesesChange],
  "two-digit-by-two-digit-multiplication": [aNewProductFromAKnownProduct],
  "three-digit-by-three-digit-multiplication": [theNumberOfDigitsInAProduct],
  "four-digit-by-two-digit-division": [theLeastToAddForAMultiple],
  "adding-fractions-with-unlike-denominators": [aMissingFractionInASum],
  "adding-and-subtracting-fractions-with-unlike-denominators-word-problems": [whatIsLeftAfterTwoFractions],
  "adding-and-subtracting-mixed-numbers-with-unlike-denominators-word-problems": [whatMixedNumberCompletesATotal],
  "multiplying-fractions-word-problems": [aFractionOfWhatIsLeft],
  "dividing-whole-numbers-by-fractions": [fullPiecesCutFromALength],
  reciprocals: [theReciprocalOfASum],
  "dividing-fractions-and-whole-numbers-word-problems": [theWholeAmountFromAFractionOfIt],
  "rounding-up-decimals": [theEndsOfARoundedDecimal],
  "comparing-decimals": [countingDecimalsBetweenTwoDecimals],
  "significant-figures-with-decimals": [countingSignificantFiguresInADecimal],
  "subtraction-with-unequal-numbers-of-decimals": [theDecimalThatCompletesAWholeNumber],
  "multiplying-two-digit-decimals": [aDecimalProductFromAWholeNumberProduct],
  "dividing-three-digit-decimals-by-two-digit-decimals": [aDecimalQuotientFromAWholeNumberQuotient],
  "multiplying-numbers-by-powers-of-ten-with-exponents": [zerosAtTheEndOfAPowerOfAMultipleOfTen],
  "evaluating-exponents": [theMissingExponent],
  "evaluating-larger-exponents": [theLastDigitOfALargePower],
  "volumes-of-right-rectangular-prisms": [howVolumeGrowsWhenEdgesGrow],
  "volumes-of-right-rectangular-prisms-word-problems": [howManyCubesFillABox],
  "solving-real-world-problems-using-coordinates": [theAreaOfARectangleFromItsCorners],
  "connecting-patterns": [aFarTermOfARelatedPattern],
  "rectangles-rhombuses-and-squares": [aSquareWithTheSamePerimeter],
  polygons: [diagonalsFromOneVertex],
};
