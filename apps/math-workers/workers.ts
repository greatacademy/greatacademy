import { fileURLToPath, URL } from "node:url";

import { bindings } from "cf/config";

// One request can log in the web Worker, the gateway and a shard. Errors reach the web Worker through RPC, and it logs every
// request, so these Workers log a sample.
const common = { compatibilityDate: "2026-10-23", observability: { enabled: true, headSamplingRate: 0.01 } };
const entry = (path: string) => fileURLToPath(new URL(path, import.meta.url));

/** shardWorkers are the configurations of the Workers holding the generators of mathematics. */
export const shardWorkers = ["school", "algebra", "calculus", "college", "exam"].map((shard) => ({
  ...common,
  name: `ga-math-${shard}`,
  entrypoint: entry(`./src/shards/${shard}.ts`),
}));

/** gatewayWorker is the configuration of the Worker that serves mathematics to the web Worker. */
export const gatewayWorker = {
  ...common,
  name: "ga-math",
  entrypoint: entry("./src/gateway.ts"),
  env: {
    SHARD_SCHOOL: bindings.worker({ worker: "ga-math-school" }),
    SHARD_ALGEBRA: bindings.worker({ worker: "ga-math-algebra" }),
    SHARD_CALCULUS: bindings.worker({ worker: "ga-math-calculus" }),
    SHARD_COLLEGE: bindings.worker({ worker: "ga-math-college" }),
    SHARD_EXAM: bindings.worker({ worker: "ga-math-exam" }),
  },
};
