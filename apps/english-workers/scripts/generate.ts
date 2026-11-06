// Writes what the gateway holds: the manifest of the subject and the topics of each shard.

import { mkdirSync, writeFileSync } from "node:fs";
import { URL } from "node:url";

import { subjectManifest, type TopicDef } from "@ga/content";
import { compileEnglish } from "@ga/content-english";
import { coreShardTopics } from "@ga/content-english/shards/core";

const held: Record<string, readonly TopicDef[]> = {
  SHARD_CORE: coreShardTopics,
};

const dir = new URL("../gen/", import.meta.url);
mkdirSync(dir, { recursive: true });
writeFileSync(new URL("manifest.json", dir), JSON.stringify(subjectManifest(compileEnglish())));
writeFileSync(
  new URL("shards.json", dir),
  JSON.stringify(Object.fromEntries(Object.entries(held).map(([binding, topics]) => [binding, topics.map((t) => t.id)]))),
);
