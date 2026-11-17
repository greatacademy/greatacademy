// The topics of the `core` shard: for now, all of Chinese. See docs/architecture.md on why content is split.

import type { TopicDef } from "@ga/content";

import { characterTopics } from "../characters/index.ts";
import { grammarTopics } from "../grammar/index.ts";
import { idiomTopics } from "../idioms/index.ts";
import { recitationTopics } from "../recitation/index.ts";

/** coreShardTopics are the topics of the core shard. */
export const coreShardTopics: readonly TopicDef[] = [...characterTopics, ...idiomTopics, ...grammarTopics, ...recitationTopics];
