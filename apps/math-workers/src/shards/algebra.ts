import { algebraShardTopics } from "@ga/content-math/shards/algebra";
import { mathCheckers } from "@ga/subject-math";
import { shardWorker } from "@ga/subject-worker";

export default shardWorker(algebraShardTopics, mathCheckers);
