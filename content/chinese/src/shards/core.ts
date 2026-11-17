// The topics of the `core` shard: for now, all of Chinese. See docs/architecture.md on why content is split.

import type { TopicDef } from "@ga/content";

import { characterTopics } from "../characters/index.ts";

/** coreShardTopics are the topics of the core shard. */
export const coreShardTopics: readonly TopicDef[] = [...characterTopics];
