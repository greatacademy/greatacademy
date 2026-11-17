import { defineConfig } from "cf/config";

import { gatewayWorker } from "./workers.ts";

export default defineConfig({ worker: gatewayWorker });
