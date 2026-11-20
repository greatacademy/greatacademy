import { fileURLToPath, URL } from "node:url";

import { bindings } from "cf/config";

// One request can log in the web Worker, the gateway and a shard. Errors reach the web Worker through RPC, and it logs every
// request, so these Workers log a sample.
// They are reached only through service bindings, so they have no workers.dev address.
const common = {
  compatibilityDate: "2026-10-23",
  observability: { enabled: true, headSamplingRate: 0.01 },
  workersDev: false,
};
const entry = (path: string) => fileURLToPath(new URL(path, import.meta.url));

/** shardWorkers are the configurations of the Workers holding the generators of Chinese. */
export const shardWorkers = ["core", "levels", "hsk"].map((shard) => ({
  ...common,
  name: `ga-chinese-${shard}`,
  entrypoint: entry(`./src/shards/${shard}.ts`),
}));

/** gatewayWorker is the configuration of the Worker that serves Chinese to the web Worker. */
export const gatewayWorker = {
  ...common,
  name: "ga-chinese",
  entrypoint: entry("./src/gateway.ts"),
  env: {
    SHARD_CORE: bindings.worker({ worker: "ga-chinese-core" }),
    SHARD_LEVELS: bindings.worker({ worker: "ga-chinese-levels" }),
    SHARD_HSK: bindings.worker({ worker: "ga-chinese-hsk" }),
  },
};
