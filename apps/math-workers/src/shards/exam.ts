import { examShardTopics } from "@ga/content-math/shards/exam";
import { mathCheckers } from "@ga/subject-math";
import { shardWorker } from "@ga/subject-worker";

export default shardWorker(examShardTopics, mathCheckers);
