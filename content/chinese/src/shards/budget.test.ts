import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * HEAP_MB is the heap each shard must fit in, loaded and asked for a problem of each knowledge point. A Worker isolate has
 * 128 MB; the sources run here take about 25 MB more than the bundle a Worker loads, so this leaves room to spare.
 */
const HEAP_MB = 112;

const script = fileURLToPath(new URL("./budget.ts", import.meta.url));

describe("the shards of Chinese", () => {
  for (const shard of ["core", "levels", "hsk"]) {
    it(`fit ${shard} in ${HEAP_MB} MB of heap`, { timeout: 60_000 }, () => {
      const run = spawnSync(process.execPath, [`--max-old-space-size=${HEAP_MB}`, script, shard], { encoding: "utf8" });
      expect(run.stderr.split("\n").find((l) => /heap|Error/.test(l)) ?? "", "").toBe("");
      expect(run.status).toBe(0);
      expect(JSON.parse(run.stdout).problems).toBeGreaterThan(0);
    });
  }
});
