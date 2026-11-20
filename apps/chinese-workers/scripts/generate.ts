// Writes what the gateway holds: the manifest of the subject and the topics and passages of each shard.

import { mkdirSync, writeFileSync } from "node:fs";
import { URL } from "node:url";

import { passagesOf, type ReadingUnitDef, subjectManifest, type TopicDef } from "@ga/content";
import { compileChinese } from "@ga/content-chinese";
import { coreShardReading, coreShardTopics } from "@ga/content-chinese/shards/core";
import { hskShardTopics } from "@ga/content-chinese/shards/hsk";
import { levelsShardTopics } from "@ga/content-chinese/shards/levels";

const held: Record<string, { topics: readonly TopicDef[]; reading: readonly ReadingUnitDef[] }> = {
  SHARD_CORE: { topics: coreShardTopics, reading: coreShardReading },
  SHARD_LEVELS: { topics: levelsShardTopics, reading: [] },
  SHARD_HSK: { topics: hskShardTopics, reading: [] },
};

const dir = new URL("../gen/", import.meta.url);
mkdirSync(dir, { recursive: true });
writeFileSync(new URL("manifest.json", dir), JSON.stringify(subjectManifest(compileChinese())));
writeFileSync(
  new URL("shards.json", dir),
  JSON.stringify(
    Object.fromEntries(
      Object.entries(held).map(([binding, { topics, reading }]) => [binding, [...topics, ...passagesOf(reading)].map((t) => t.id)]),
    ),
  ),
);
