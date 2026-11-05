import { schoolShardTopics } from "@ga/content-math/shards/school";
import { mathCheckers } from "@ga/subject-math";
import { shardWorker } from "@ga/subject-worker";

export default shardWorker(schoolShardTopics, mathCheckers);
