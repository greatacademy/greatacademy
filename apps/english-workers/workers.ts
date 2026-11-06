import { fileURLToPath, URL } from "node:url";

import { bindings } from "cf/config";

// One request can log in the web Worker, the gateway and a shard. Errors reach the web Worker through RPC, and it logs every
// request, so these Workers log a sample.
const common = { compatibilityDate: "2026-10-23", observability: { enabled: true, headSamplingRate: 0.01 } };
const entry = (path: string) => fileURLToPath(new URL(path, import.meta.url));

/** shardWorkers are the configurations of the Workers holding the generators of English. */
export const shardWorkers = ["core"].map((shard) => ({
  ...common,
  name: `ga-english-${shard}`,
  entrypoint: entry(`./src/shards/${shard}.ts`),
}));

/** gatewayWorker is the configuration of the Worker that serves English to the web Worker. */
export const gatewayWorker = {
  ...common,
  name: "ga-english",
  entrypoint: entry("./src/gateway.ts"),
  env: {
    SHARD_CORE: bindings.worker({ worker: "ga-english-core" }),
  },
};
