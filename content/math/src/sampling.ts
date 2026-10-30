import { formatIssue, sampleGenerators } from "@ga/content";
import { expect, it } from "vitest";

import { compileMath } from "./index.ts";

/** shards is the number of test files that sample the generators in parallel. */
export const shards = 4;

/** testShard checks the generators of one shard of the topics; generators-<n>.test.ts call it for n = 0 … shards - 1. */
export function testShard(index: number) {
  it(`has sound generators (shard ${index + 1} of ${shards})`, () => {
    const issues = sampleGenerators(compileMath(), { samples: 300, minDistinct: 25, shard: { index, count: shards } });
    expect(issues.map(formatIssue)).toEqual([]);
  }, 300_000);
}
