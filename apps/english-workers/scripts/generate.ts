// Writes what the gateway holds: the manifest of the subject and the topics and passages of each shard.

import { mkdirSync, writeFileSync } from "node:fs";
import { URL } from "node:url";

import { passagesOf, type ReadingUnitDef, subjectManifest, type TopicDef } from "@ga/content";
import { compileEnglish } from "@ga/content-english";
import { coreShardReading, coreShardTopics } from "@ga/content-english/shards/core";

const held: Record<string, { topics: readonly TopicDef[]; reading: readonly ReadingUnitDef[] }> = {
  SHARD_CORE: { topics: coreShardTopics, reading: coreShardReading },
};

const dir = new URL("../gen/", import.meta.url);
mkdirSync(dir, { recursive: true });
writeFileSync(new URL("manifest.json", dir), JSON.stringify(subjectManifest(compileEnglish())));
writeFileSync(
  new URL("shards.json", dir),
  JSON.stringify(
    Object.fromEntries(
      Object.entries(held).map(([binding, { topics, reading }]) => [binding, [...topics, ...passagesOf(reading)].map((t) => t.id)]),
    ),
  ),
);
