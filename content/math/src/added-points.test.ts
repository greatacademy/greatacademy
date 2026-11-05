/// <reference types="node" />

import { readdirSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { addedPointXp, finishTopics } from "./finish.ts";
import { algebraShardTopics } from "./shards/algebra.ts";
import { calculusShardTopics } from "./shards/calculus.ts";
import { collegeShardTopics } from "./shards/college.ts";
import { examShardTopics } from "./shards/exam.ts";
import { schoolShardTopics } from "./shards/school.ts";

const shipped = new Map<string, Set<string>>();
for (const topic of [...schoolShardTopics, ...algebraShardTopics, ...calculusShardTopics, ...collegeShardTopics, ...examShardTopics]) {
  const points = shipped.get(topic.id) ?? new Set<string>();
  for (const point of topic.knowledgePoints) points.add(point.id);
  shipped.set(topic.id, points);
}

describe("added knowledge points", () => {
  it("add to the topic's expected minutes", () => {
    const topic = algebraShardTopics[0];
    const point = topic?.knowledgePoints[0];
    if (!topic || !point) throw new Error("no topic");
    const [finished] = finishTopics([topic], [{ [topic.id]: [point, point] }]);
    expect(finished?.xp).toBe(topic.xp + 2 * addedPointXp);
    expect(finished?.knowledgePoints).toHaveLength(topic.knowledgePoints.length + 2);
  });

  // finishTopics looks each topic up in the maps, so an entry for a topic of another shard, or a map nobody registers, would silently vanish.
  it("all reach a topic of a shard", async () => {
    const lost: string[] = [];
    for (const name of readdirSync(new URL("./topics/", import.meta.url))) {
      if (!name.startsWith("deeper-") || !name.endsWith(".ts")) continue;
      const file: Record<string, unknown> = await import(`./topics/${name.slice(0, -3)}.ts`);
      for (const [key, map] of Object.entries(file)) {
        if (typeof map !== "object" || map === null || !key.endsWith("Points")) continue;
        for (const [topic, points] of Object.entries(map as Record<string, readonly { id: string }[]>)) {
          for (const point of points) if (!shipped.get(topic)?.has(point.id)) lost.push(`${name} ${topic} > ${point.id}`);
        }
      }
    }
    expect(lost).toEqual([]);
  }, 60_000);
});
