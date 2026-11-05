// Writes what the gateway holds: the manifest of the subject and the topics of each shard.

import { mkdirSync, writeFileSync } from "node:fs";
import { URL } from "node:url";

import { subjectManifest, type TopicDef } from "@ga/content";
import { compileMath } from "@ga/content-math";
import { algebraShardTopics } from "@ga/content-math/shards/algebra";
import { calculusShardTopics } from "@ga/content-math/shards/calculus";
import { collegeShardTopics } from "@ga/content-math/shards/college";
import { examShardTopics } from "@ga/content-math/shards/exam";
import { schoolShardTopics } from "@ga/content-math/shards/school";

const held: Record<string, readonly TopicDef[]> = {
  SHARD_ALGEBRA: algebraShardTopics,
  SHARD_CALCULUS: calculusShardTopics,
  SHARD_COLLEGE: collegeShardTopics,
  SHARD_EXAM: examShardTopics,
  SHARD_SCHOOL: schoolShardTopics,
};

const dir = new URL("../gen/", import.meta.url);
mkdirSync(dir, { recursive: true });
writeFileSync(new URL("manifest.json", dir), JSON.stringify(subjectManifest(compileMath())));
writeFileSync(
  new URL("shards.json", dir),
  JSON.stringify(Object.fromEntries(Object.entries(held).map(([binding, topics]) => [binding, topics.map((t) => t.id)]))),
);
