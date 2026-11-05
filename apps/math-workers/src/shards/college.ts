import { collegeShardTopics } from "@ga/content-math/shards/college";
import { mathCheckers } from "@ga/subject-math";
import { shardWorker } from "@ga/subject-worker";

export default shardWorker(collegeShardTopics, mathCheckers);
