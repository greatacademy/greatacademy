import { chineseCheckers } from "@ga/subject-chinese";
import { lazyShardWorker } from "@ga/subject-worker";

// Chinese builds its problem banks as its modules load, which takes longer than a Worker may take to start, so the shard
// imports its content on the first call.
export default lazyShardWorker(async () => {
  const { levelsShardTopics } = await import("@ga/content-chinese/shards/levels");
  return { topics: levelsShardTopics };
}, chineseCheckers);
