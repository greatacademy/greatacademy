import { coreShardReading, coreShardTopics } from "@ga/content-english/shards/core";
import { englishCheckers } from "@ga/subject-english";
import { shardWorker } from "@ga/subject-worker";

export default shardWorker(coreShardTopics, englishCheckers, coreShardReading);
