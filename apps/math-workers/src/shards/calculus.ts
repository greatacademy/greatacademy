import { calculusShardTopics } from "@ga/content-math/shards/calculus";
import { mathCheckers } from "@ga/subject-math";
import { shardWorker } from "@ga/subject-worker";

export default shardWorker(calculusShardTopics, mathCheckers);
