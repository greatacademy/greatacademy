// A second set of further knowledge points for 5th Grade Math, mostly the same facts run
// backwards or used in a longer setting. See `deeperGrade5MorePoints`.

import type { KnowledgePointDef } from "@ga/content";

import { aFractionOfAFractionOfANumber, theWholeFromAFractionOfIt } from "./fractions.ts";
import {
  aDigitTenTimesAsGreat,
  changeFromABulkPurchase,
  comparingUnitPrices,
  countingSignificantFiguresInAWholeNumber,
  findingAMissingBase,
  theRestOfADecimalTotal,
  zerosInAProductOfPowersOfTen,
} from "./grade-5-decimals.ts";
import { thePartLeftOfAWhole } from "./grade-5-fractions.ts";
import { elapsedMinutesAcrossHours, theAreaOfARectangleOnAMap, theHeightFromACountOfCubes } from "./grade-5-measurement.ts";
import { aProductFromANearbyProduct, theDivisorFromAQuotientAndRemainder } from "./grade-5-whole-numbers.ts";

/** deeperGrade5MorePoints maps topics of 5th Grade Math to a second set of further knowledge points. */
export const deeperGrade5MorePoints: Readonly<Record<string, readonly KnowledgePointDef[]>> = {
  "multi-digit-by-two-digit-multiplication": [aProductFromANearbyProduct],
  "three-digit-by-two-digit-division": [theDivisorFromAQuotientAndRemainder],
  "subtracting-fractions-with-unlike-denominators": [thePartLeftOfAWhole],
  "multiplying-fractions": [aFractionOfAFractionOfANumber],
  "dividing-fractions": [theWholeFromAFractionOfIt],
  "comparing-place-values-with-decimals": [aDigitTenTimesAsGreat],
  "significant-figures": [countingSignificantFiguresInAWholeNumber],
  "subtracting-decimals": [theRestOfADecimalTotal],
  "multiplying-a-decimal-by-a-multi-digit-whole-number": [changeFromABulkPurchase],
  "dividing-decimals-using-the-standard-algorithm": [comparingUnitPrices],
  "powers-of-ten": [zerosInAProductOfPowersOfTen],
  "introduction-to-exponents": [findingAMissingBase],
  "converting-units-of-time-to-larger-units": [elapsedMinutesAcrossHours],
  "coordinate-planes-as-maps": [theAreaOfARectangleOnAMap],
  "understanding-volume-using-unit-cubes": [theHeightFromACountOfCubes],
};
