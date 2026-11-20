// Loads a shard of Chinese and asks each of its knowledge points for a problem, a request at a time, so that budget.test.ts
// can run it under a heap as small as a Worker's (docs/architecture.md). Run as `node budget.ts <shard>`.

import { createRng, type TopicDef } from "@ga/content";

const SHARDS: Readonly<Record<string, () => Promise<readonly TopicDef[]>>> = {
  core: async () => (await import("./core.ts")).coreShardTopics,
  levels: async () => (await import("./levels.ts")).levelsShardTopics,
  hsk: async () => (await import("./hsk.ts")).hskShardTopics,
};

const load = SHARDS[process.argv[2] ?? ""];
if (!load) throw new Error(`budget: no shard ${process.argv[2]}`);
const topics = await load();
let problems = 0;
for (const topic of topics) {
  for (const kp of topic.knowledgePoints) {
    kp.generate(createRng(`${kp.id}:1`));
    problems++;
  }
  // As between requests: a rebuilt bank is held weakly, and only let go once the task that asked for it ends.
  await new Promise((resolve) => setImmediate(resolve));
}
console.log(JSON.stringify({ topics: topics.length, problems }));
