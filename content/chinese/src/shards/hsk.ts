// The topics of the `hsk` shard: the exam topics of the HSK courses, which build on the topics of the levels. See
// docs/architecture.md on why content is split.

import type { TopicDef } from "@ga/content";

import { hskTopics } from "../hsk/index.ts";

/** hskShardTopics are the topics of the hsk shard. */
export const hskShardTopics: readonly TopicDef[] = hskTopics;
