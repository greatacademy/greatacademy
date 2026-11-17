import { coreShardReading, coreShardTopics } from "@ga/content-chinese/shards/core";
import { chineseCheckers } from "@ga/subject-chinese";
import { shardWorker } from "@ga/subject-worker";

export default shardWorker(coreShardTopics, chineseCheckers, coreShardReading);
