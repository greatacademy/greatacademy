import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import { beforeAll, describe, expect, it } from "vitest";

import { shardWorkers } from "../workers.ts";

/**
 * HEAP_MB bounds the whole heap a built shard runs under, every space together, 24 MB short of the 128 MB of an isolate;
 * YOUNG_MB keeps its young generation as small as an isolate's, which Node would otherwise let grow.
 */
const HEAP_MB = 104;
const YOUNG_MB = 4;

const root = fileURLToPath(new URL("..", import.meta.url));
const script = fileURLToPath(new URL("./check-shard.ts", import.meta.url));

/** chunk is the content chunk of a built shard, which its Worker imports on its first call. */
function chunk(worker: string): string {
  const assets = `${root}.cloudflare/output/v0/workers/${worker}/bundle/assets/`;
  const shard = worker.replace("ga-chinese-", "");
  const found = readdirSync(assets).filter((f) => f.startsWith(`${shard}-`) && f.endsWith(".js"));
  if (found.length !== 1) throw new Error(`${worker}: ${found.length} content chunks`);
  return assets + found[0];
}

describe("the built shards of Chinese", () => {
  beforeAll(() => {
    // Built here, so that what is checked is the bundle of these sources and not one left from before.
    const build = spawnSync(`${root}node_modules/.bin/cf`, ["build"], { cwd: root, encoding: "utf8" });
    expect(build.status, build.stderr).toBe(0);
  }, 120_000);

  for (const { name } of shardWorkers) {
    it(`load ${name} and serve each knowledge point within the heap of a Worker`, { timeout: 120_000 }, () => {
      const run = spawnSync(process.execPath, [`--max-heap-size=${HEAP_MB}`, `--max-semi-space-size=${YOUNG_MB}`, script, chunk(name)], {
        encoding: "utf8",
      });
      expect(run.status, run.stderr.split("\n").slice(0, 8).join("\n")).toBe(0);
      expect((JSON.parse(run.stdout) as { problems: number }).problems).toBeGreaterThan(0);
    });
  }
});
