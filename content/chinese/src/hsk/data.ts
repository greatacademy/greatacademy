// The characters and words each HSK course draws on (docs/chinese-curriculum.md §8.5): the batches of the levels it
// tests, from the levels' plans, so that the HSK courses need none of the levels' topics.

import type { LevelOneCharacter } from "../level-1/characters.ts";
import { levelOnePlan } from "../level-1/plan.ts";
import type { LevelOneWord } from "../level-1/words.ts";
import { levelTwoPlan } from "../level-2/plan.ts";
import { levelThreePlan } from "../level-3/plan.ts";
import { levelFourPlan } from "../level-4/plan.ts";
import { levelFivePlan } from "../level-5/plan.ts";
import { levelSixPlan } from "../level-6/plan.ts";
import { levelSevenPlan } from "../level-7/plan.ts";
import { levelEightPlan } from "../level-8/plan.ts";
import { levelNinePlan } from "../level-9/plan.ts";

/** LevelData are the character and word batches of one level. */
export interface LevelData {
  readonly level: number;
  readonly characters: readonly (readonly LevelOneCharacter[])[];
  readonly words: readonly (readonly LevelOneWord[])[];
}

/** levelData are the batches of levels 1 to 9, in order. */
export const levelData: readonly LevelData[] = [
  levelOnePlan,
  levelTwoPlan,
  levelThreePlan,
  levelFourPlan,
  levelFivePlan,
  levelSixPlan,
  levelSevenPlan,
  levelEightPlan,
  levelNinePlan,
].map((plan, i) => ({ level: i + 1, characters: plan.characterBatches, words: plan.wordBatches }));
