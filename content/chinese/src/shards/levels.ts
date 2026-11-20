// The topics of the `levels` shard: the nine levels of Chinese as a foreign language and their handwriting. See
// docs/architecture.md on why content is split.

import type { TopicDef } from "@ga/content";

import { levelOneTopics } from "../level-1/index.ts";
import { levelTwoTopics } from "../level-2/index.ts";
import { levelThreeTopics } from "../level-3/index.ts";
import { levelFourTopics } from "../level-4/index.ts";
import { levelFiveTopics } from "../level-5/index.ts";
import { levelSixTopics } from "../level-6/index.ts";
import { levelSevenTopics } from "../level-7/index.ts";
import { levelEightTopics } from "../level-8/index.ts";
import { levelNineTopics } from "../level-9/index.ts";
import { levelHandwritingTopics } from "../strokes/levels.ts";

/** levelsShardTopics are the topics of the levels shard. */
export const levelsShardTopics: readonly TopicDef[] = [
  ...levelOneTopics,
  ...levelTwoTopics,
  ...levelThreeTopics,
  ...levelFourTopics,
  ...levelFiveTopics,
  ...levelSixTopics,
  ...levelSevenTopics,
  ...levelEightTopics,
  ...levelNineTopics,
  ...levelHandwritingTopics,
];
