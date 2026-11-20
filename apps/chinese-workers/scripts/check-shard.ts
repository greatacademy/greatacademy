// Loads the content chunk of one built shard of Chinese, as its Worker does on its first call, and asks each of its
// knowledge points for a problem, a request at a time, recording the most of the heap it used. Run by
// check-shard.test.ts under a limited heap: `node check-shard.ts <chunk>`.

import { getHeapStatistics } from "node:v8";
import { createRng, type TopicDef } from "@ga/content";

const chunk = process.argv[2];
if (!chunk) throw new Error("usage: check-shard <chunk>");
let peak = 0;
let committed = 0;
const sample = () => {
  const h = getHeapStatistics();
  peak = Math.max(peak, h.used_heap_size + h.external_memory);
  committed = Math.max(committed, h.total_heap_size);
};
const mod: Record<string, unknown> = await import(chunk);
sample();
const topics = Object.values(mod).find(
  (v): v is readonly TopicDef[] => Array.isArray(v) && typeof v[0] === "object" && v[0] !== null && "knowledgePoints" in v[0],
);
if (!topics) throw new Error(`check-shard: ${chunk} exports no topics`);
let problems = 0;
for (const topic of topics) {
  for (const kp of topic.knowledgePoints) {
    kp.generate(createRng(`${kp.id}:1`));
    problems++;
    sample();
  }
  // As between requests: a rebuilt bank held weakly is let go only once the task that asked for it ends.
  await new Promise((resolve) => setImmediate(resolve));
}
console.log(
  JSON.stringify({ topics: topics.length, problems, peakMB: Math.round(peak / 2 ** 20), committedMB: Math.round(committed / 2 ** 20) }),
);
